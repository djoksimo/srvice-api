import { ObjectID } from "mongodb";

export interface ScheduleBooking {
  start: string;
  end: string;
  offering: ObjectID | string;
  user: ObjectID | string;
}
