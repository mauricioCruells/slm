import { MigrationInterface, QueryRunner } from "typeorm";

export class addCategoryKARelationship1682615058556 implements MigrationInterface {
    name = 'addCategoryKARelationship1682615058556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_areas" ADD "category_id" integer`);
        await queryRunner.query(`ALTER TABLE "knowledge_areas" ADD CONSTRAINT "FK_e8fc4418b3803f4f24c13e563f7" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "knowledge_areas" DROP CONSTRAINT "FK_e8fc4418b3803f4f24c13e563f7"`);
        await queryRunner.query(`ALTER TABLE "knowledge_areas" DROP COLUMN "category_id"`);
    }

}
