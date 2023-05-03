import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCompetenciesModuleTables1674516944986
  implements MigrationInterface
{
  name = 'createCompetenciesModuleTables1674516944986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."knowledge_areas_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "knowledge_areas" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "name" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "status" "public"."knowledge_areas_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_2091818c211dcd7c6c37a1a450a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."competencies_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "competencies" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "status" "public"."competencies_status_enum" NOT NULL DEFAULT 'Active', "knowledge_area_id" integer, "user_id" integer, CONSTRAINT "PK_0b29ecda233cc61de0d93527813" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."skills_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "status" "public"."skills_status_enum" NOT NULL DEFAULT 'Active', "competency_id" integer, CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."topics_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "topics" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "comments" character varying, "updated_at" TIMESTAMP DEFAULT now(), "status" "public"."topics_status_enum" NOT NULL DEFAULT 'Active', "skill_id" integer, "seniority_level_id" integer, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "competencies_evaluation_roles_evaluation_roles" ("competencies_id" integer NOT NULL, "evaluation_roles_id" integer NOT NULL, CONSTRAINT "PK_d8753a9c2825d93c5a3dbb0faac" PRIMARY KEY ("competencies_id", "evaluation_roles_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0c6727d0dc79444eca62ed001" ON "competencies_evaluation_roles_evaluation_roles" ("competencies_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_76864bf58c8a921bf1f02fee30" ON "competencies_evaluation_roles_evaluation_roles" ("evaluation_roles_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies" ADD CONSTRAINT "FK_a656d723488e884842cc1bc02fc" FOREIGN KEY ("knowledge_area_id") REFERENCES "knowledge_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies" ADD CONSTRAINT "FK_f39e321c2646d1dae5fa8fa8041" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "skills" ADD CONSTRAINT "FK_f8e10f4a81c732c18df96158462" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" ADD CONSTRAINT "FK_e740d984d3132cd5bb162592aa2" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" ADD CONSTRAINT "FK_e927a94383a4b4cb93b4fd9dc87" FOREIGN KEY ("seniority_level_id") REFERENCES "seniority_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies_evaluation_roles_evaluation_roles" ADD CONSTRAINT "FK_c0c6727d0dc79444eca62ed001b" FOREIGN KEY ("competencies_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies_evaluation_roles_evaluation_roles" ADD CONSTRAINT "FK_76864bf58c8a921bf1f02fee306" FOREIGN KEY ("evaluation_roles_id") REFERENCES "evaluation_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "competencies_evaluation_roles_evaluation_roles" DROP CONSTRAINT "FK_76864bf58c8a921bf1f02fee306"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies_evaluation_roles_evaluation_roles" DROP CONSTRAINT "FK_c0c6727d0dc79444eca62ed001b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" DROP CONSTRAINT "FK_e927a94383a4b4cb93b4fd9dc87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topics" DROP CONSTRAINT "FK_e740d984d3132cd5bb162592aa2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skills" DROP CONSTRAINT "FK_f8e10f4a81c732c18df96158462"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies" DROP CONSTRAINT "FK_f39e321c2646d1dae5fa8fa8041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competencies" DROP CONSTRAINT "FK_a656d723488e884842cc1bc02fc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_76864bf58c8a921bf1f02fee30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0c6727d0dc79444eca62ed001"`,
    );
    await queryRunner.query(
      `DROP TABLE "competencies_evaluation_roles_evaluation_roles"`,
    );
    await queryRunner.query(`DROP TABLE "topics"`);
    await queryRunner.query(`DROP TYPE "public"."topics_status_enum"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TYPE "public"."skills_status_enum"`);
    await queryRunner.query(`DROP TABLE "competencies"`);
    await queryRunner.query(`DROP TYPE "public"."competencies_status_enum"`);
    await queryRunner.query(`DROP TABLE "knowledge_areas"`);
    await queryRunner.query(`DROP TYPE "public"."knowledge_areas_status_enum"`);
  }
}
