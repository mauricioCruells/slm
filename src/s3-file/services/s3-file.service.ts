import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { presignedUrlExpiryTime } from '../constants';

@Injectable()
export class S3FileService {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.configService.get('APP_ACCESS_KEY'),
        secretAccessKey: this.configService.get('APP_SECRET_KEY'),
      },
      region: this.configService.get('S3_BUCKET_REGION'),
    });
  }

  public async getFileByEtag(
    etag: string,
    bucketName: string,
    bucketFolderPath: string,
  ): Promise<GetObjectCommandOutput> {
    const params: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: bucketFolderPath,
      IfMatch: etag,
    };

    try {
      return await this.s3.send(new GetObjectCommand(params));
    } catch (err) {
      console.error('Error: ', err);
      throw new NotFoundException('File not found');
    }
  }

  public async uploadBufferFile(
    fileBuffer: Buffer,
    bucketName: string,
    bucketFolderPath: string,
  ): Promise<PutObjectCommandOutput> {
    const params: PutObjectCommandInput = {
      Body: fileBuffer,
      Bucket: bucketName,
      Key: bucketFolderPath,
    };

    try {
      return this.s3.send(new PutObjectCommand(params));
    } catch (err) {
      if (this.configService.get('NODE_ENV') === 'development') {
        console.log(err);
      }
      throw new UnprocessableEntityException(
        'something went wrong uploading the file',
      );
    }
  }

  public async generatePresignedUrl(key: string): Promise<string> {
    const params: GetObjectCommandInput = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: key,
    };

    const command = new GetObjectCommand(params);

    try {
      return getSignedUrl(this.s3, command, {
        expiresIn: presignedUrlExpiryTime,
      });
    } catch (error) {
      if (this.configService.get('NODE_ENV') === 'development') {
        console.log(error);
      }

      throw new UnprocessableEntityException(
        'Something went wrong generating object presigned url',
      );
    }
  }
}
