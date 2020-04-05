import { Storage } from "@google-cloud/storage";

import { GoogleValues } from "../values";
import { UuidUtils, GoogleUtils } from "../utilities";

export default class FileService {
  gcsStorage: Storage;

  constructor() {
    this.gcsStorage = new Storage({
      projectId: GoogleValues.GCP_PROJECT_ID,
      keyFilename: "./src/values/google.json",
    });
  }

  async getPublicUrlFromUpload(file) {
    try {
      if (!file) {
        return new Error("File not defined");
      }
      const bucket = this.gcsStorage.bucket(GoogleValues.BUCKET_NAME);
      const fileName = `${UuidUtils.generateUUID()}`;
      const blob = await bucket.file(fileName);

      const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
        predefinedAcl: "publicRead",
      });

      const uploadResult = new Promise((resolve, reject) => {
        stream.on("finish", () => {
          resolve(GoogleUtils.getPublicUrl(`${GoogleValues.BUCKET_NAME}/${fileName}`));
        });
        stream.on("error", (err) => {
          reject(err);
        });
        stream.end(file.buffer);
      });
      return uploadResult;
    } catch (error) {
      return error;
    }
  }
}
