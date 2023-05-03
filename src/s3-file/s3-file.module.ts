import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';

import {
  S3ExampleFilesService,
  S3FileService,
  ImageFileService,
} from './services';
import { S3CommonFilesRepository } from './repositories';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([S3CommonFilesRepository])],
  providers: [S3FileService, S3ExampleFilesService, ImageFileService],
  exports: [S3FileService, S3ExampleFilesService, ImageFileService],
})
export class S3FileModule {}
