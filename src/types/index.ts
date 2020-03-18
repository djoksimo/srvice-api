import { ObjectID } from "mongodb";
import { Availability } from "./schedule/Availability";

export interface Offering {
  _id?: ObjectID;
  title: string;
  duration: number;
  price: number;
  description: string;
  isDeleted: boolean;
  agent: string | ObjectID | Agent;
}

export interface Category {
  _id: ObjectID;
  name: string;
  iconUrl: string;
}

export interface Agent {
  _id?: ObjectID;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: Date;
  profilePictureUrl: string;
  services: Service;
  location: string;
  languages: Array<string>;
  company: string;
  education: Array<string>;
  certifications: Array<string>;
  phone: string;
  governmentIdUrl: string;
  secondaryIdUrl: string;
  skills: Array<string>;
  selfieUrl: string;
  givenRatings: ServiceRating[];
  schedule: ObjectID;
}

export interface Service {
  _id?: string | ObjectID;
  agent: string | ObjectID | Agent;
  category: string | ObjectID | Category;
  title: string;
  description: string;
  pictureUrls: string[];
  phone: string;
  email: string;
  inCall: boolean;
  outCall: boolean;
  remoteCall: boolean;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  averageServiceRating: number;
  serviceRatings: ServiceRating[];
  offerings: Offering[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: Date;
  profilePictureUrl: string;
}

export interface ServiceRating {
  _id: string;
  user: User;
  service: Service;
  overallRating: number;
  priceRating: number;
  punctualityRating: number;
  friendlinessRating: number;
  comment: string;
  date: Date;
  isDeleted: boolean;
}

export interface Booking {
  _id?: string;
  request: string;
  agent: Agent;
  service: Service;
  priceEstimate: number;
  agentAccepted: boolean;
  userAccepted: boolean;
}

export { AuthHeaders } from "./AuthHeaders";
export { Minutes } from "./Time";
export { HttpResult } from "./HttpResult";

export { AvailabilitySlot, Availability, AvailabilityRequestPayload } from "./schedule";
