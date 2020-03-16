import ScheduleService from "services/ScheduleService";
import AgentService from "services/AgentService";
import { Availability, Booking } from "types/schedule";
import { ObjectID } from "mongodb";
import { Minutes, AuthHeaders, Schedule } from "types";
import { ScheduleModel } from "../models";

interface NewSchedulePayload {
  availability: Availability[];
  agentId: ObjectID;
}

interface AvailabilitySlotsParams {
  scheduleId: ObjectID;
  offeringDurationInMin: Minutes;
  startDateString: string;
  endDateString: string;
}

interface AddBookingPayload {
  scheduleId: ObjectID;
  booking: Booking;
}

export default class ScheduleManager {
  scheduleService: ScheduleService;

  agentService: AgentService;

  constructor(scheduleService: ScheduleService, agentService: AgentService) {
    this.scheduleService = scheduleService;
    this.agentService = agentService;
  }

  async createSchedule({ availability, agentId }: NewSchedulePayload) {
    const newSchedule = new ScheduleModel({
      availability,
      bookings: [],
      agent: agentId,
    });

    try {
      const agentDocument: any = await this.agentService.getNonPopulatedAgentById(agentId);
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

  async getAvailableSlots({
    scheduleId,
    offeringDurationInMin,
    startDateString,
    endDateString,
  }: AvailabilitySlotsParams) {
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

  async patchSchedule(newPartialScheduleData: Partial<Schedule>, authHeaders: AuthHeaders) {
    try {
      const result = await this.scheduleService.updateSchedule(newPartialScheduleData, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      console.log(error);
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async addBookingToSchedule({ scheduleId, booking }: AddBookingPayload) {
    try {
      const result = await this.scheduleService.addBookingAndSort(scheduleId, booking);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}
