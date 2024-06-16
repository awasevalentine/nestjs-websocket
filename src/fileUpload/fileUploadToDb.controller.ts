import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    ParseFilePipeBuilder,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { SampleDto } from './dto/sample.dto';
import { FileService } from './service/fileUpload.service';
import { multerConfigByDb } from './multer.memory.config';
import { FileUploadEntity } from './schema/fileupload.schema';
import { Response } from 'express';
  
  @Controller('file-upload-v2')
  export class FileUploadToDbController {
    constructor(private readonly fileService: FileService) {}
  
    @UseInterceptors(FileInterceptor('file', multerConfigByDb))
    @Post('file')
    async uploadFile(
      @Body() payload: SampleDto,
      @UploadedFile() file: Express.Multer.File,
    ) {

        if(!file){
            throw new HttpException("no file", 404)
        }
      const savedFile = await this.fileService.saveFile(file);
      return {
        payload,
        file: {
          id: savedFile.id,
          filename: savedFile.filename,
          mimetype: savedFile.mimetype,
        },
      };
    }
  
    @UseInterceptors(FileInterceptor('file', multerConfigByDb))
    @Post('file/pass-validation')
    async uploadFileAndPassValidation(
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
      const savedFile = file ? await this.fileService.saveFile(file) : null;
      return {
        body,
        file: savedFile
          ? {
              id: savedFile.id,
              filename: savedFile.filename,
              mimetype: savedFile.mimetype,
            }
          : null,
      };
    }
  
    @UseInterceptors(FileInterceptor('file', multerConfigByDb))
    @Post('file/fail-validation')
    async uploadFileAndFailValidation(
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
      const savedFile = await this.fileService.saveFile(file);
      return {
        body,
        file: {
          id: savedFile.id,
          filename: savedFile.filename,
          mimetype: savedFile.mimetype,
        },
      };
    }


    @Get(':id')
    async getFile(@Param('id') id: number, @Res() res: Response) {
      try {
        const file: FileUploadEntity = await this.fileService.getFileById(id);
  
        if (!file) {
          throw new NotFoundException('File not found');
        }
  
        res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
        res.setHeader('Content-Type', file.mimetype);
        res.send(file.data);
      } catch (error) {
        throw new HttpException('Could not retrieve file', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  }
  