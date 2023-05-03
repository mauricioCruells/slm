import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDescriptionFieldInKnowledgeAreaEntity1676522292548
  implements MigrationInterface
{
  name = 'addDescriptionFieldInKnowledgeAreaEntity1676522292548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "description"`,
    );
  }
}
