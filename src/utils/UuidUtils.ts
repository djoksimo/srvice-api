import uuidv4 from "uuid/v4";

export class UuidUtils {
  static generateUUID() {
    return `${uuidv4()}${uuidv4()}`;
  }
}
