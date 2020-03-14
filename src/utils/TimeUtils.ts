export class TimeUtils {
  static minutesToHours(minutes: number) {
    return minutes / 60;
  }

  static minutesToMilliseconds(minutes: number) {
    return minutes * 60 * 1000;
  }
}
