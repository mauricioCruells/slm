import { MigrationInterface, QueryRunner } from 'typeorm';

export class addS3CommonFilesTable1681771460382 implements MigrationInterface {
  name = 'addS3CommonFilesTable1681771460382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "s3_common_files" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "etag" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ccb93b9b1a6db6708a71b67441" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "s3_common_files"`);
  }
}
