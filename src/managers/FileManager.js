const { GoogleValues } = require("../values");

class FileManager {
  constructor(FileService) {
    this.fileService = FileService;
  }

  getPublicUrl(fileName) {
    return `https://storage.googleapis.com/${GoogleValues.BUCKET_NAME}/${fileName}.png`;
  }

  async uploadPictures(files) {
    try {
      const resp = {
        publicPictureUrls: [],
      };
      await Promise.all(files.map(async (file) => {
        const { filename, path } = file;
        await this.fileService.getSmallPngFromTemp(filename, path);
        await this.fileService.uploadToBucket(`${path}.png`);
        await this.fileService.removeTempFile(path);
        await this.fileService.removeTempFile(`${path}.png`);
        return resp.publicPictureUrls.push(this.getPublicUrl(filename));
      }));
      return { status: 200, json: resp };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = FileManager;
