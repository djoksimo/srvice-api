import fs from "fs";

export class FileUtils {
  static async asyncWriteToFileOnce(fileName, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, content, (err) => {
        if (err) {
          reject(err);
        }
        resolve(null);
      });
    });
  }
}
