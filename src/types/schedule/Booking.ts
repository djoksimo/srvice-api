import { Service, Agent } from "types";

export interface Booking {
  _id?: string;
  request: string;
  agent: Agent;
  service: Service;
  priceEstimate: number;
  agentAccepted: boolean;
  userAccepted: boolean;
}
