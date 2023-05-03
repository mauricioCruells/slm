import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeSeniorityLevelFromTopics1681839302953
  implements MigrationInterface
{
  name = 'removeSeniorityLevelFromTopics1681839302953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topics" DROP CONSTRAINT "FK_e927a94383a4b4cb93b4fd9dc87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" DROP COLUMN "seniority_level_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topics" ADD "seniority_level_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" ADD CONSTRAINT "FK_e927a94383a4b4cb93b4fd9dc87" FOREIGN KEY ("seniority_level_id") REFERENCES "seniority_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
