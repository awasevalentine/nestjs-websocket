import {
    Body,
    Controller,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Express } from 'express';
  import { FileUploadDto, SampleDto } from './dto/sample.dto';
  import { multerConfig } from './multer.config'; // Import the multer configuration
  
  @Controller('file-upload')
  export class FileUploadController {
    constructor() {}
  
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @Post('file')
    uploadFile(
      @Body() payload: FileUploadDto,
      @UploadedFile() file: FileUploadDto,
    ) {
      return {
        payload,
        file: {
          originalname: file.file.originalname,
          filename: file.file.filename,
          path: file.file.path,
          mimetype: file.file.mimetype,
        },
      };
    }
  
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @Post('file/pass-validation')
    uploadFileAndPassValidation(
      @Body() body: FileUploadDto,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: 'json',
          })
          .build({
            fileIsRequired: false,
          }),
      )
      file?: FileUploadDto,
    ) {
      return {
        body,
        file: file.file?.buffer.toString(),
      };
    }
  
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @Post('file/fail-validation')
    uploadFileAndFailValidation(
      @Body() body: FileUploadDto,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: 'jpg',
          })
          .build(),
      )
      file: FileUploadDto,
    ) {
      return {
        body,
        file: file.file.buffer.toString(),
      };
    }
  }
  