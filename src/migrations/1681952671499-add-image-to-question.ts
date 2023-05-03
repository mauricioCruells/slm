import { MigrationInterface, QueryRunner } from "typeorm";

export class addImageToQuestion1681952671499 implements MigrationInterface {
    name = 'addImageToQuestion1681952671499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ADD "image_id" integer`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_c3a97cface66e060976f19bb9a6" FOREIGN KEY ("image_id") REFERENCES "s3_common_files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_c3a97cface66e060976f19bb9a6"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "image_id"`);
    }

}
