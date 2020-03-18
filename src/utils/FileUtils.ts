import fs from "fs";

export class FileUtils {
  static async asyncWriteToFileOnce(fileName: string, content: any) {
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
