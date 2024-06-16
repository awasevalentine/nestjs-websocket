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
  import { SampleDto } from './dto/sample.dto';
  import { multerConfig } from './multer.config'; // Import the multer configuration
  
  @Controller('file-upload')
  export class FileUploadController {
    constructor() {}
  
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @Post('file')
    uploadFile(
      @Body() payload: SampleDto,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return {
        payload,
        file: {
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
        },
      };
    }
  
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @Post('file/pass-validation')
    uploadFileAndPassValidation(
      @Body() body: SampleDto,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: 'json',
          })
          .build({
            fileIsRequired: false,
          }),
      )
      file?: Express.Multer.File,
    ) {
      return {
        body,
        file: file?.buffer.toString(),
      };
    }
  
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @Post('file/fail-validation')
    uploadFileAndFailValidation(
      @Body() body: SampleDto,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: 'jpg',
          })
          .build(),
      )
      file: Express.Multer.File,
    ) {
      return {
        body,
        file: file.buffer.toString(),
      };
    }
  }
  