class OutputUtils {
  static getPrettyJSON(val) {
    return JSON.stringify(val, null, 2);
  }
}

module.exports = OutputUtils;
