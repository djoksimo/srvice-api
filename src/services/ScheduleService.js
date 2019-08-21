const { ScheduleModel } = require("../models");

class ScheduleService {
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
    return ScheduleModel.updateOne({ _id: scheduleId }, {
      $push: {
        bookings: {
          $each: [booking],
          $sort: { end: 1 },
        },
      },
    }).exec();
  }
}

module.exports = ScheduleService;
