import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadEntity } from '../schema/fileupload.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileUploadEntity)
    private readonly fileUploadRepository: Repository<FileUploadEntity>,
  ) {}

  async saveFile(file: Express.Multer.File): Promise<FileUploadEntity> {

    console.log('File buffer:', file);
    const newFile = this.fileUploadRepository.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer, // Ensure the buffer is being assigned
    });
    return this.fileUploadRepository.save(newFile);
  }


  async getFileById(id: number): Promise<FileUploadEntity> {
    return await this.fileUploadRepository.findOne({where:{id}});
  }

}
