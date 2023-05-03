import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEvaluationRolesTable1670003311827
  implements MigrationInterface
{
  name = 'addEvaluationRolesTable1670003311827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."evaluation_roles_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluation_roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "status" "public"."evaluation_roles_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_7bf6a895be856f0efe1ac975c28" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "evaluation_roles"`);
    await queryRunner.query(
      `DROP TYPE "public"."evaluation_roles_status_enum"`,
    );
  }
}
