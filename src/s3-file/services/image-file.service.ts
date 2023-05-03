import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as crypto from 'crypto';

import { S3CommonFilesRepository } from '../repositories';
import {
  AllowedMimetypes,
  ImageResizeDimensions,
  MaxImageSize,
  questionImagesFolder,
} from '../constants';
import { S3FileService } from './s3-file.service';
import { S3CommonFiles } from '../entities';

@Injectable()
export class ImageFileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3CommonFilesRepository: S3CommonFilesRepository,
    private readonly s3FileService: S3FileService,
  ) {}

  async uploadImageFile(
    imageFile: Express.Multer.File,
  ): Promise<S3CommonFiles> {
    this.validateImageProperties(imageFile);

    const slug = this.generateSlug(imageFile.buffer);

    const fileExtension = imageFile.originalname.split('.').pop();

    const key = `${questionImagesFolder}/${slug}.${fileExtension}`;

    const imageBuffer = await this.resizeAndRemoveExif(imageFile.buffer);

    const uploadResult = await this.s3FileService.uploadBufferFile(
      imageBuffer,
      this.configService.get('S3_BUCKET_NAME'),
      key,
    );

    const serializedEtag = uploadResult.ETag.replace(/"/g, '');

    const url = await this.s3FileService.generatePresignedUrl(key);

    let image = await this.s3CommonFilesRepository.findOneBySlug(slug);

    if (!image) {
      image = this.s3CommonFilesRepository.create({
        slug,
        name: key,
      });
    }

    image = { ...image, etag: serializedEtag, url };

    await this.s3CommonFilesRepository.save(image);

    return image;
  }

  private validateImageProperties(imageFile: Express.Multer.File): void {
    if (!AllowedMimetypes.includes(imageFile.mimetype)) {
      throw new UnprocessableEntityException(
        `Image mimetype not allowed, must be one of: ${AllowedMimetypes}`,
      );
    }

    if (imageFile.size > MaxImageSize) {
      throw new UnprocessableEntityException(
        `Image filesize exceeded, must be lower than ${MaxImageSize} bytes`,
      );
    }
  }

  private generateSlug(imageBuffer: Buffer): string {
    const hash = crypto.createHash('md5');
    hash.update(imageBuffer);
    return hash.digest('hex');
  }

  private async resizeAndRemoveExif(imageBuffer: Buffer): Promise<Buffer> {
    const image = sharp(imageBuffer);
    try {
      return image
        .resize(ImageResizeDimensions.width, ImageResizeDimensions.height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .withMetadata({ exif: undefined })
        .toBuffer();
    } catch (error) {
      if (this.configService.get('NODE_ENV') === 'development') {
        console.log(error);
      }
      throw new UnprocessableEntityException(
        'something went wrong while resizing the image',
      );
    }
  }
}
