const uuidv4 = require("uuid/v4");

class UuidUtils {
  static generateUUID() {
    return uuidv4();
  }
}

module.exports = UuidUtils;
