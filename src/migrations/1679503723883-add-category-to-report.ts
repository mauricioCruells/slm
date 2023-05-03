import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCategoryToReport1679503723883 implements MigrationInterface {
  name = 'addCategoryToReport1679503723883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report" ADD "category_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_43c9bfc713c0e2a3c21c4a583c5" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_43c9bfc713c0e2a3c21c4a583c5"`,
    );
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "category_id"`);
  }
}
