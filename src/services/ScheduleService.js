const { ScheduleModel } = require("../models");

class ScheduleService {

  saveSchedule(newSchedule) {
    return newSchedule.save();
  }

  updateSchedule(schedule) {
    return ScheduleModel.update({ _id: schedule.id }, { $set: schedule }).exec();
  }

  addBookingAndSort(scheduleId, booking) {
    return ScheduleModel.findByIdAndUpdate(scheduleId, {
      $push: {
        bookings: {
          $each: [booking],
          $sort: { "booking.end": -1 },
        },
      },
    }).exec();
  }
}

module.exports = ScheduleService;
