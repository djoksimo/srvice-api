const sharp = require("sharp");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage");

const { GoogleValues } = require("../values");

class FileService {
  constructor() {
    this.storage = new Storage();
    this.bucketName = GoogleValues.BUCKET_NAME;

    this.uploadOptions = {
      gzip: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    };
  }

  getSmallPngFromTemp(filename, filePath) {
    return sharp(filePath).toFile(`tmp/${filename}.png`);
  }

  removeTempFile(filePath) {
    return fs.unlink(filePath, (err) => {
      if (err) {
        return err;
      }
      return null;
    });
  }

  uploadToBucket(filePath) {
    return this.storage.bucket(this.bucketName).upload(filePath, this.uploadOptions);
  }
}

module.exports = FileService;
