const { ScheduleModel } = require("../models");

class ScheduleManager {

  constructor(scheduleService, agentService) {
    this.scheduleService = scheduleService;
    this.agentService = agentService;
  }

  async createSchedule({ availability, agentId }) {
    const newSchedule = new ScheduleModel({
      availability,
      bookings: [],
    });

    try {
      const scheduleDocument = await this.scheduleService.saveSchedule(newSchedule);
      await this.agentService.addScheduleToAgent(agentId, scheduleDocument.toObject()._id);
      return { status: 201, json: {} };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async patchSchedule(schedule) {
    try {
      const result = await this.scheduleService.updateSchedule(schedule);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async addBookingToSchedule({ scheduleId, booking }) {
    try {
      const result = await this.scheduleService.addBookingAndSort(scheduleId, booking);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = ScheduleManager;
