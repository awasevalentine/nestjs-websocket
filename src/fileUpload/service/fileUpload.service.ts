import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadEntity } from '../schema/fileupload.schema';
import { FileUploadDto } from '../dto/sample.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileUploadEntity)
    private readonly fileUploadRepository: Repository<FileUploadEntity>,
  ) {}

  async saveFile(file: FileUploadDto): Promise<FileUploadEntity> {
    const newFile = this.fileUploadRepository.create({
      sender: file?.sender,
      filename: file?.file?.originalname,
      mimetype: file?.file?.mimetype,
      data: file?.file?.buffer, // Ensure the buffer is being assigned
    });
    return this.fileUploadRepository.save(newFile);
  }


  async getFileById(id: number): Promise<FileUploadEntity> {
    return await this.fileUploadRepository.findOne({where:{id}});
  }

}
