import { ObjectID } from "mongodb";

export interface NewOfferingPayload {
  serviceId: ObjectID | string;
  title: string;
  duration: number;
  price: number;
  description: string;
  agent: string;
}
