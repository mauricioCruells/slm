import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAssessmentsAndRelationships1676508620971
  implements MigrationInterface
{
  name = 'addAssessmentsAndRelationships1676508620971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assessment" ("id" SERIAL NOT NULL, "knowledge_area_id" integer, CONSTRAINT "PK_c511a7dc128256876b6b1719401" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assessment_users_users" ("assessment_id" integer NOT NULL, "users_id" integer NOT NULL, CONSTRAINT "PK_c835c6f17ed31cebb281add9df9" PRIMARY KEY ("assessment_id", "users_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_895d7c70b5f073dde4090d2c06" ON "assessment_users_users" ("assessment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a2a0a3d2ed2a6498e8604c24d" ON "assessment_users_users" ("users_id") `,
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
      `CREATE TABLE "users_assessments_assessment" ("users_id" integer NOT NULL, "assessment_id" integer NOT NULL, CONSTRAINT "PK_cb2b19e67466aa9de8ab7fe5692" PRIMARY KEY ("users_id", "assessment_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb5dafa4ac19b7124b3a20c8cc" ON "users_assessments_assessment" ("users_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0fb220535af10505b64f4f1360" ON "users_assessments_assessment" ("assessment_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluation_roles_assessments_assessment" ("evaluation_roles_id" integer NOT NULL, "assessment_id" integer NOT NULL, CONSTRAINT "PK_a2634a0959be49aedab9ec43416" PRIMARY KEY ("evaluation_roles_id", "assessment_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7e139a5a71628e258df3bcbb1" ON "evaluation_roles_assessments_assessment" ("evaluation_roles_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5d9beed0d4e3bd7f3ec8e227b" ON "evaluation_roles_assessments_assessment" ("assessment_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment" ADD CONSTRAINT "FK_797d0ef0c98717fe69c8511669b" FOREIGN KEY ("knowledge_area_id") REFERENCES "knowledge_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_users_users" ADD CONSTRAINT "FK_895d7c70b5f073dde4090d2c060" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_users_users" ADD CONSTRAINT "FK_4a2a0a3d2ed2a6498e8604c24d7" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" ADD CONSTRAINT "FK_ca562278c00b88d087474f13a0a" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" ADD CONSTRAINT "FK_1b12ea10567c0f393b49840d6d4" FOREIGN KEY ("evaluation_roles_id") REFERENCES "evaluation_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_assessments_assessment" ADD CONSTRAINT "FK_fb5dafa4ac19b7124b3a20c8cc9" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_assessments_assessment" ADD CONSTRAINT "FK_0fb220535af10505b64f4f1360f" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" ADD CONSTRAINT "FK_d7e139a5a71628e258df3bcbb13" FOREIGN KEY ("evaluation_roles_id") REFERENCES "evaluation_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" ADD CONSTRAINT "FK_b5d9beed0d4e3bd7f3ec8e227b3" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" DROP CONSTRAINT "FK_b5d9beed0d4e3bd7f3ec8e227b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles_assessments_assessment" DROP CONSTRAINT "FK_d7e139a5a71628e258df3bcbb13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_assessments_assessment" DROP CONSTRAINT "FK_0fb220535af10505b64f4f1360f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_assessments_assessment" DROP CONSTRAINT "FK_fb5dafa4ac19b7124b3a20c8cc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" DROP CONSTRAINT "FK_1b12ea10567c0f393b49840d6d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_evaluation_roles_evaluation_roles" DROP CONSTRAINT "FK_ca562278c00b88d087474f13a0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_users_users" DROP CONSTRAINT "FK_4a2a0a3d2ed2a6498e8604c24d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment_users_users" DROP CONSTRAINT "FK_895d7c70b5f073dde4090d2c060"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assessment" DROP CONSTRAINT "FK_797d0ef0c98717fe69c8511669b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5d9beed0d4e3bd7f3ec8e227b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7e139a5a71628e258df3bcbb1"`,
    );
    await queryRunner.query(
      `DROP TABLE "evaluation_roles_assessments_assessment"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0fb220535af10505b64f4f1360"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb5dafa4ac19b7124b3a20c8cc"`,
    );
    await queryRunner.query(`DROP TABLE "users_assessments_assessment"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1b12ea10567c0f393b49840d6d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca562278c00b88d087474f13a0"`,
    );
    await queryRunner.query(
      `DROP TABLE "assessment_evaluation_roles_evaluation_roles"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a2a0a3d2ed2a6498e8604c24d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_895d7c70b5f073dde4090d2c06"`,
    );
    await queryRunner.query(`DROP TABLE "assessment_users_users"`);
    await queryRunner.query(`DROP TABLE "assessment"`);
  }
}
