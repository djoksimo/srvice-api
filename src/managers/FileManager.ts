import FileService from "services/FileService";

interface UploadResponse {
  publicPictureUrls: string[];
}

export default class FileManager {
  fileService: FileService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  async uploadPictures(files: Express.Multer.File[]) {
    try {
      const resp: UploadResponse = {
        publicPictureUrls: [],
      };
      resp.publicPictureUrls = await Promise.all(
        files.map(async (file) => this.fileService.getPublicUrlFromUpload(file)),
      );
      return { status: 200, json: resp };
    } catch (error) {
      return { status: 500, json: error.toString() };
    }
  }
}
