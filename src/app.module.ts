import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/websocket.module';
import { FileUploadModule } from './fileUpload/fileupload.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadEntity } from './fileUpload/schema/fileupload.schema';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/test_upload'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'P@ssword001',
      database: 'file_upload',
      entities: [FileUploadEntity],
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ChatModule,
    FileUploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {}
