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
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async patchSchedule(schedule, authHeaders) {
    try {
      const result = await this.scheduleService.updateSchedule(schedule, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      console.log(error);
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async addBookingToSchedule({ scheduleId, booking }) {
    try {
      const result = await this.scheduleService.addBookingAndSort(scheduleId, booking);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}

module.exports = ScheduleManager;
