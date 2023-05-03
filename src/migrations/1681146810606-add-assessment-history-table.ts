import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAssessmentHistoryTable1681146810606
  implements MigrationInterface
{
  name = 'addAssessmentHistoryTable1681146810606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assessment_history" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "executed_by" integer NOT NULL, "assessment_id" integer NOT NULL, CONSTRAINT "PK_9e348b4f1550062304a7097bf65" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_history" ADD CONSTRAINT "FK_ce895bf8533757810442ae63091" FOREIGN KEY ("executed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_history" ADD CONSTRAINT "FK_f27f8233f74602db658272008c3" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assessment_history" DROP CONSTRAINT "FK_f27f8233f74602db658272008c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_history" DROP CONSTRAINT "FK_ce895bf8533757810442ae63091"`,
    );
    await queryRunner.query(`DROP TABLE "assessment_history"`);
  }
}
