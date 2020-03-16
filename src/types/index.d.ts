import { Availability } from "./schedule/Availability";
import { Booking } from "./schedule/Booking";

export interface Offering {
  _id?: string;
  title: string;
  duration: number;
  price: number;
  description: string;
  isDeleted: boolean;
}

export interface Category {
  _id: string;
  name: string;
  iconUrl: string;
}

export interface Agent {
  _id?: string;
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
  schedule: string;
}

export interface Service {
  _id?: string;
  agent: Agent;
  category: Category;
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

export interface Schedule {
  _id?: string;
  availability: Availability[];
  bookings: Booking[];
  agent: Agent;
}

export { AuthHeaders } from "./AuthHeaders";
export { Minutes } from "./Time";
export { HttpResult } from "./HttpResult";
