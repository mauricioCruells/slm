import { MigrationInterface, QueryRunner } from 'typeorm';

export class moveWeightFieldFromQuestionsToCompetency1678122864103
  implements MigrationInterface
{
  name = 'moveWeightFieldFromQuestionsToCompetency1678122864103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "weight"`);
    await queryRunner.query(
      `ALTER TABLE "competencies" ADD "weight" numeric NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "competencies" DROP COLUMN "weight"`);
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "weight" integer NOT NULL`,
    );
  }
}
