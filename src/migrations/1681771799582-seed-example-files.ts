import * as fs from 'fs';

import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';

import { ExampleFilesSlug } from '@Core/enums';

export class seedExampleFiles1681771799582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.APP_ACCESS_KEY,
        secretAccessKey: process.env.APP_SECRET_KEY,
      },
      region: process.env.S3_BUCKET_REGION,
    });

    const fileName = 'SLM_Questions.csv';
    const bucketName = process.env.S3_BUCKET_NAME;

    const filePath = 'dist/example-files/' + fileName;

    const fileStream = fs.createReadStream(filePath);
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: filePath,
      Body: fileStream,
    };

    const command = new PutObjectCommand(params);

    try {
      const data = await s3.send(command);
      const serializedEtag = data.ETag.replace(/"/g, '');

      const questionFileSlug = ExampleFilesSlug.QUESTIONS_FILE;

      const s3CommonFilesExists = await queryRunner.hasTable('s3_common_files');

      if (s3CommonFilesExists) {
        await queryRunner.query(
          `INSERT INTO s3_common_files (slug, name, etag) VALUES ('${questionFileSlug}', '${filePath}', '${serializedEtag}')`,
        );
      }
    } catch (err) {
      console.log('Error: ', err);
      throw new Error(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
