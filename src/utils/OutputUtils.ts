export class OutputUtils {
  static getPrettyJSON(val: any) {
    return JSON.stringify(val, null, 2);
  }
}
