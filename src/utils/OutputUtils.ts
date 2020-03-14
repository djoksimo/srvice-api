export class OutputUtils {
  static getPrettyJSON(val) {
    return JSON.stringify(val, null, 2);
  }
}
