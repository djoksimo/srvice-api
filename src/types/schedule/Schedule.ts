import { Availability, Agent } from "types";
import { ObjectID } from "mongodb";
import { ScheduleBooking } from "./ScheduleBooking";

export interface Schedule {
  _id?: ObjectID;
  availability: Availability[];
  bookings: ScheduleBooking[];
  agent: Agent | ObjectID | string;
}
