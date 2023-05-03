import { MigrationInterface, QueryRunner } from "typeorm";

export class addUrlToS3File1682026219262 implements MigrationInterface {
    name = 'addUrlToS3File1682026219262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s3_common_files" ADD "url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s3_common_files" DROP COLUMN "url"`);
    }

}
