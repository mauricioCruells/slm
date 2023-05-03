import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReportTableAndRelationships1679333596339
  implements MigrationInterface
{
  name = 'addReportTableAndRelationships1679333596339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report" ("report_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "generated_by_id" integer, CONSTRAINT "PK_1bdd9ab86f1a920d365961cb28c" PRIMARY KEY ("report_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report_knowledge_areas_knowledge_areas" ("report_report_id" integer NOT NULL, "knowledge_areas_id" integer NOT NULL, CONSTRAINT "PK_a7cb2fca57720661ff4091c6daf" PRIMARY KEY ("report_report_id", "knowledge_areas_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2bb28d5eb9475c22d9e25b76fb" ON "report_knowledge_areas_knowledge_areas" ("report_report_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96cc105d2c00c2cc830a4842cf" ON "report_knowledge_areas_knowledge_areas" ("knowledge_areas_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "report_interviewees_users" ("report_report_id" integer NOT NULL, "users_id" integer NOT NULL, CONSTRAINT "PK_4187c8bf11581aff77161975f61" PRIMARY KEY ("report_report_id", "users_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_142275ed875ad98947ec8c8665" ON "report_interviewees_users" ("report_report_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7167d98f46fdb226b504e7db05" ON "report_interviewees_users" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_completed_assessments_assessment" ("users_id" integer NOT NULL, "assessment_id" integer NOT NULL, CONSTRAINT "PK_c2bb6514d22ebbc643ce3a0f315" PRIMARY KEY ("users_id", "assessment_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68c4085e50869bebfc4dca269d" ON "users_completed_assessments_assessment" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf14faf248c4b5b40c670858ba" ON "users_completed_assessments_assessment" ("assessment_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_9828021162458b967d0101781ae" FOREIGN KEY ("generated_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_knowledge_areas_knowledge_areas" ADD CONSTRAINT "FK_2bb28d5eb9475c22d9e25b76fb8" FOREIGN KEY ("report_report_id") REFERENCES "report"("report_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_knowledge_areas_knowledge_areas" ADD CONSTRAINT "FK_96cc105d2c00c2cc830a4842cf7" FOREIGN KEY ("knowledge_areas_id") REFERENCES "knowledge_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_interviewees_users" ADD CONSTRAINT "FK_142275ed875ad98947ec8c86656" FOREIGN KEY ("report_report_id") REFERENCES "report"("report_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_interviewees_users" ADD CONSTRAINT "FK_7167d98f46fdb226b504e7db056" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_completed_assessments_assessment" ADD CONSTRAINT "FK_68c4085e50869bebfc4dca269df" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_completed_assessments_assessment" ADD CONSTRAINT "FK_cf14faf248c4b5b40c670858ba4" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_completed_assessments_assessment" DROP CONSTRAINT "FK_cf14faf248c4b5b40c670858ba4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_completed_assessments_assessment" DROP CONSTRAINT "FK_68c4085e50869bebfc4dca269df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_interviewees_users" DROP CONSTRAINT "FK_7167d98f46fdb226b504e7db056"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_interviewees_users" DROP CONSTRAINT "FK_142275ed875ad98947ec8c86656"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_knowledge_areas_knowledge_areas" DROP CONSTRAINT "FK_96cc105d2c00c2cc830a4842cf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report_knowledge_areas_knowledge_areas" DROP CONSTRAINT "FK_2bb28d5eb9475c22d9e25b76fb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_9828021162458b967d0101781ae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf14faf248c4b5b40c670858ba"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68c4085e50869bebfc4dca269d"`,
    );
    await queryRunner.query(
      `DROP TABLE "users_completed_assessments_assessment"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7167d98f46fdb226b504e7db05"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_142275ed875ad98947ec8c8665"`,
    );
    await queryRunner.query(`DROP TABLE "report_interviewees_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96cc105d2c00c2cc830a4842cf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2bb28d5eb9475c22d9e25b76fb"`,
    );
    await queryRunner.query(
      `DROP TABLE "report_knowledge_areas_knowledge_areas"`,
    );
    await queryRunner.query(`DROP TABLE "report"`);
  }
}
