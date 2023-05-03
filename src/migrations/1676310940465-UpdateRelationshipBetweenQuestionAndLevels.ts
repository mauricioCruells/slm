import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelationshipBetweenQuestionAndLevels1676310940465
  implements MigrationInterface
{
  name = 'UpdateRelationshipBetweenQuestionAndLevels1676310940465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "REL_97cb5a1d1eea1692c817d7e514"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147" FOREIGN KEY ("level_id") REFERENCES "seniority_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "REL_97cb5a1d1eea1692c817d7e514" UNIQUE ("level_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147" FOREIGN KEY ("level_id") REFERENCES "seniority_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
