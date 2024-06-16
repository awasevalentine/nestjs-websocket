import { Schema, Document, model } from 'mongoose';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface FileDocument extends Document {
  filename: string;
  mimetype: string;
  data: Buffer;
}

export const FileSchema = new Schema<FileDocument>({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  data: { type: Buffer, required: true },
});

// export const FileModel = model<FileDocument>('File', FileSchema);


@Entity('files')
export class FileUploadEntity{

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    filename: string

    @Column()
    mimetype: string;

    @Column({type: 'bytea'})
    data: Buffer
}
