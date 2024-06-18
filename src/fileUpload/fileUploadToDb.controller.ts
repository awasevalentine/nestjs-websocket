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
import { FileUploadDto } from './dto/sample.dto';
import { FileService } from './service/fileUpload.service';
import { multerConfigByDb } from './multer.memory.config';
import { FileUploadEntity } from './schema/fileupload.schema';
import { Response } from 'express';
import * as csv from 'csv-parser';
import * as stream from 'stream';
import { promisify } from 'util';

const finished = promisify(stream.finished);

@Controller('file-upload-v2')
export class FileUploadToDbController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file', multerConfigByDb))
  @Post('file')
  async uploadFile(
    @Body() payload: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file', HttpStatus.NOT_FOUND);
    }
    const payload1 = {
      sender: payload.sender,
      file: file,
    };
    const savedFile = await this.fileService.saveFile(payload1);
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
    @Body() body: FileUploadDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    // Expected CSV headers
    const expectedHeaders = ['header1', 'header2', 'header3']; // replace with your expected headers

    // Function to check CSV headers
    const validateCsvHeaders = async (file: Express.Multer.File): Promise<void> => {
      const headers = await new Promise<string[]>((resolve, reject) => {
        const headers: string[] = [];
        const parser = csv()
          .on('headers', (parsedHeaders) => {
            headers.push(...parsedHeaders);
            parser.end(); // Stop parsing after getting headers
          })
          .on('error', (error) => reject(error));
        
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);
        bufferStream.pipe(parser);
        finished(bufferStream).then(() => resolve(headers)).catch(reject);
      });

      const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
      if (missingHeaders.length > 0) {
        throw new HttpException(`Missing headers: ${missingHeaders.join(', ')}`, HttpStatus.BAD_REQUEST);
      }
    };

    try {
      await validateCsvHeaders(file);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    const payload = {
      sender: body?.sender,
      file: file,
    };
    
    return {
      body,
      // file: savedFile
      //   ? {
      //       id: savedFile.id,
      //       filename: savedFile.filename,
      //       mimetype: savedFile.mimetype,
      //     }
      //   : null,
    };
  }

  @UseInterceptors(FileInterceptor('file', multerConfigByDb))
  @Post('file/fail-validation')
  async uploadFileAndFailValidation(
    @Body() body: FileUploadDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    const payload = {
      sender: body?.sender,
      file: file,
    };
    const savedFile = await this.fileService.saveFile(payload);
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
