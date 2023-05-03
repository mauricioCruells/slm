import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeAssessmentEvaluationRoleRelation1682539695893
  implements MigrationInterface
{
  name = 'removeAssessmentEvaluationRoleRelation1682539695893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" DROP CONSTRAINT "FK_b5d9beed0d4e3bd7f3ec8e227b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" DROP CONSTRAINT "FK_d7e139a5a71628e258df3bcbb13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" DROP CONSTRAINT "FK_1b12ea10567c0f393b49840d6d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" DROP CONSTRAINT "FK_ca562278c00b88d087474f13a0a"`,
    );
    await queryRunner.query(
      `DROP TABLE "evaluation_roles_assessments_assessment"`,
    );
    await queryRunner.query(
      `DROP TABLE "assessment_evaluation_roles_evaluation_roles"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "evaluation_roles_assessments_assessment" ("evaluation_roles_id" integer NOT NULL, "assessment_id" integer NOT NULL, CONSTRAINT "PK_a2634a0959be49aedab9ec43416" PRIMARY KEY ("evaluation_roles_id", "assessment_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assessment_evaluation_roles_evaluation_roles" ("assessment_id" integer NOT NULL, "evaluation_roles_id" integer NOT NULL, CONSTRAINT "PK_7d5d278affa4c7a5dbc34a4d0ac" PRIMARY KEY ("assessment_id", "evaluation_roles_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca562278c00b88d087474f13a0" ON "assessment_evaluation_roles_evaluation_roles" ("assessment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1b12ea10567c0f393b49840d6d" ON "assessment_evaluation_roles_evaluation_roles" ("evaluation_roles_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7e139a5a71628e258df3bcbb1" ON "evaluation_roles_assessments_assessment" ("evaluation_roles_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5d9beed0d4e3bd7f3ec8e227b" ON "evaluation_roles_assessments_assessment" ("assessment_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" ADD CONSTRAINT "FK_ca562278c00b88d087474f13a0a" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" ADD CONSTRAINT "FK_1b12ea10567c0f393b49840d6d4" FOREIGN KEY ("evaluation_roles_id") REFERENCES "evaluation_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" ADD CONSTRAINT "FK_d7e139a5a71628e258df3bcbb13" FOREIGN KEY ("evaluation_roles_id") REFERENCES "evaluation_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" ADD CONSTRAINT "FK_b5d9beed0d4e3bd7f3ec8e227b3" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
