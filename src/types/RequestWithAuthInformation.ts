import { Request } from "express";

export interface RequestWithAuthInformation extends Request {
  user: any;
}
