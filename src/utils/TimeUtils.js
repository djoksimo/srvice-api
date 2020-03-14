class TimeUtils {
  static minutesToHours(minutes) {
    return minutes / 60;
  }

  static minutesToMilliseconds(minutes) {
    return minutes * 60 * 1000;
  }
}

module.exports = TimeUtils;
