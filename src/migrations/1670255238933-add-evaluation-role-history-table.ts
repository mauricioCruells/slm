import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEvaluationRoleHistoryTable1670255238933
  implements MigrationInterface
{
  name = 'addEvaluationRoleHistoryTable1670255238933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "evaluation_roles_history" ("id" SERIAL NOT NULL, "old_evaluation_role" character varying NOT NULL, "new_evaluation_role" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_6a3283b7a654504236f805278ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_history" ADD CONSTRAINT "FK_3f48f901646c7ecdc5d924b212b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_history" DROP CONSTRAINT "FK_3f48f901646c7ecdc5d924b212b"`,
    );
    await queryRunner.query(`DROP TABLE "evaluation_roles_history"`);
  }
}
