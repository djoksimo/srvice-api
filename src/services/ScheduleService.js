const { ScheduleModel } = require("../models");

class ScheduleService {

  saveSchedule(newSchedule) {
    return newSchedule.save();
  }

  updateSchedule(schedule) {
    return ScheduleModel.update({ _id: schedule.id }, { $set: schedule }).exec();
  }
}

module.exports = ScheduleService;
