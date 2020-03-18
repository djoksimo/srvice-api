import { File } from "@google-cloud/storage";

import { FileService } from "../services";

interface UploadResponse {
  publicPictureUrls: string[];
}

export default class FileManager {
  fileService: FileService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  async uploadPictures(files: File[]) {
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
