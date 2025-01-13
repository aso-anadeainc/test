import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }
      return file.filename;
    } catch (e) {
      console.error('File upload error:', e);
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
