import { v4 } from "uuid";

export class UuidUtils {
  static generateUUID() {
    return `${v4()}${v4()}`;
  }
}
