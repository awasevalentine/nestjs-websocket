import { Module } from "@nestjs/common";
import { FileUploadController } from "./file.controler";
import { FileUploadToDbController } from "./fileUploadToDb.controller";
import { FileService } from "./service/fileUpload.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FileSchema, FileUploadEntity } from "./schema/fileupload.schema";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([FileUploadEntity])
    ],
    controllers: [FileUploadController, FileUploadToDbController],
    providers: [FileService]
})


export class FileUploadModule {}