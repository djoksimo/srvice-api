import moment, { utc } from "moment";

import { ScheduleModel } from "../models";
import { Weekdays } from "../values";
import { TimeUtils } from "../utils";

const SLOT_INTERVAL_IN_MIN = 5;

export default class ScheduleService {
  static isOwner(scheduleId, agentId) {
    return new Promise((resolve, reject) => {
      ScheduleModel.findById(scheduleId, (err, schedule) => {
        if (err) {
          return reject(err);
        }
        if (!schedule) {
          return reject(new Error("Could not find schedule"));
        }
        const scheduleDocument = schedule.toObject();
        const { agent } = scheduleDocument;
        if (agentId !== agent.toString()) {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }

  saveSchedule(newSchedule) {
    return newSchedule.save();
  }

  async updateSchedule(schedule, agentId) {
    const isOwner = await ScheduleService.isOwner(schedule._id, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY ;)");
    }
    return ScheduleModel.updateOne({ _id: schedule._id }, { $set: schedule }).exec();
  }

  addBookingAndSort(scheduleId, booking) {
    return ScheduleModel.updateOne(
      { _id: scheduleId },
      {
        $push: {
          bookings: {
            $each: [booking],
            $sort: { end: 1 },
          },
        },
      },
    ).exec();
  }

  findScheduleById(scheduleId) {
    return ScheduleModel.findById(scheduleId).exec();
  }

  generateAvailabilityCandidates(offeringDurationInMin, startDateString, endDateString) {
    if (offeringDurationInMin < SLOT_INTERVAL_IN_MIN && offeringDurationInMin > 24) {
      throw new Error(`offeringDurationInMin does not satisfy ${SLOT_INTERVAL_IN_MIN} <=offeringDurationInMin <= 24 `);
    }

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const availableSlots = [];

    for (
      let startSecondsIndex = startDate.getTime();
      startSecondsIndex < endDate.getTime();
      startSecondsIndex += TimeUtils.minutesToMilliseconds(SLOT_INTERVAL_IN_MIN) // increment by 5 minutes
    ) {
      const endTime = startSecondsIndex + offeringDurationInMin * (60 * 1000);
      availableSlots.push({
        start: new Date(startSecondsIndex),
        end: new Date(endTime),
      });
    }

    return availableSlots;
  }

  filterOutUnviableSlot(availableSlots, scheduleDocument) {
    return availableSlots.filter((slot) => {
      const foundWorkDay = scheduleDocument.availability.find(
        (workHourSlot) =>
          Weekdays.getWeekdayStringFromDate(slot.start).toLowerCase() === workHourSlot.weekday.toLowerCase(),
      );

      // filter out otpions that do not align with the Agent's work hours
      if (!foundWorkDay) {
        return false;
      }

      const getHourFloat = (date) => date.getUTCHours() + TimeUtils.minutesToHours(date.getUTCMinutes());

      const startHourFloat = getHourFloat(slot.start);
      const endHourFloat = getHourFloat(slot.end);

      if (
        startHourFloat < foundWorkDay.start ||
        endHourFloat > foundWorkDay.end ||
        endHourFloat < foundWorkDay.start ||
        startHourFloat > foundWorkDay.end
      ) {
        return false;
      }

      // filter out options that overlap with existing bookings
      if (
        scheduleDocument.bookings.find(
          (booking) =>
            moment(slot.start).isBetween(moment(booking.start), moment(booking.end), null, "()") ||
            moment(slot.end).isBetween(moment(booking.start), moment(booking.end), null, "()") ||
            moment(booking.start).isBetween(moment(slot.start), moment(slot.end), null, "()") ||
            moment(booking.end).isBetween(moment(slot.start), moment(slot.end), null, "()"),
        )
      ) {
        return false;
      }

      return true;
    });
  }

  getCategorizedSlotsByDate(availableSlots) {
    if (!availableSlots.length) {
      return {};
    }

    const datesAreOnSameDay = (first, second) =>
      first.getUTCFullYear() === second.getUTCFullYear() &&
      first.getUTCMonth() === second.getUTCMonth() &&
      first.getUTCDate() === second.getUTCDate();

    const getDateString = (date) => utc(date).format("MMMM Do YYYY");

    const datesObject = {};

    let currentDateString = getDateString(availableSlots[0].start);
    let currentDate = availableSlots[0].start;

    availableSlots.forEach((slot) => {
      if (datesAreOnSameDay(slot.start, currentDate)) {
        if (datesObject[currentDateString]) {
          datesObject[currentDateString].push(slot);
        } else {
          datesObject[currentDateString] = [slot];
        }
      } else {
        currentDate = slot.start;
        currentDateString = getDateString(slot.start);
        datesObject[currentDateString] = [slot];
      }
    });

    return datesObject;
  }
}
