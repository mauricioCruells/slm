import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

import { ExampleFilesSlug } from '@Core/enums';

import { S3CommonFilesRepository } from '../repositories';
import { S3FileService } from './s3-file.service';

@Injectable()
export class S3ExampleFilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3FileService: S3FileService,
    private readonly s3CommonFilesRepository: S3CommonFilesRepository,
  ) {}

  public async getExampleFileBySlug(
    slug: ExampleFilesSlug,
  ): Promise<GetObjectCommandOutput> {
    const exampleFile = await this.s3CommonFilesRepository.findOneBySlug(slug);

    return this.s3FileService.getFileByEtag(
      exampleFile.etag,
      this.configService.get('S3_BUCKET_NAME'),
      exampleFile.name,
    );
  }
}
