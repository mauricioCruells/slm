import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeCorrectAnswerField1675468742797
  implements MigrationInterface
{
  name = 'changeCorrectAnswerField1675468742797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP COLUMN "correct_answer_id"`,
    );
    await queryRunner.query(`ALTER TABLE "option" ADD "is_correct" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "option" DROP COLUMN "is_correct"`);
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "correct_answer_id" integer NOT NULL`,
    );
  }
}
