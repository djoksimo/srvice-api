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
      agent: agentId,
    });

    try {
      const agentDocument = await this.agentService.getNonPopulatedAgentById(agentId);
      if (agentDocument && agentDocument.schedule) {
        throw new Error("Agent already has schedule");
      }
      const scheduleDocument = await this.scheduleService.saveSchedule(newSchedule);
      await this.agentService.addScheduleToAgent(agentId, scheduleDocument.toObject()._id);
      return { status: 201, json: {} };
    } catch (error) {
      console.log(error);
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async getAvailableSlots({ scheduleId, offeringDurationInMin, startDateString, endDateString }) {
    try {
      const scheduleDocument = await this.scheduleService.findScheduleById(scheduleId);

      let availableSlots = this.scheduleService.generateAvailabilityCandidates(
        offeringDurationInMin,
        startDateString,
        endDateString,
      );

      availableSlots = this.scheduleService.filterOutUnviableSlot(availableSlots, scheduleDocument);

      const categorizedSlotsByDate = this.scheduleService.getCategorizedSlotsByDate(availableSlots);

      return { status: 200, json: categorizedSlotsByDate };
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
