import { Injectable } from '@nestjs/common';
import type { File as MulterFile } from 'multer';

@Injectable()
export class UploadService {
  handleSingleFile(file: MulterFile) {
    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`,
    };
  }

  handleMultiFiles(files: MulterFile[]) {
    return files.map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`,
    }));
  }
}
