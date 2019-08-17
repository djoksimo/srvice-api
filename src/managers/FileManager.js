class FileManager {
  constructor(FileService) {
    this.fileService = FileService;
  }

  async uploadPictures(files) {
    try {
      const resp = {
        publicPictureUrls: [],
      };
      resp.publicPictureUrls = await Promise.all(files.map(async file => this.fileService.getPublicUrlFromUpload(file)));
      return { status: 200, json: resp };
    } catch (error) {
      return { status: 500, json: error.toString() };
    }
  }
}

module.exports = FileManager;
