import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRolesTable1670002687170 implements MigrationInterface {
  name = 'addRolesTable1670002687170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."roles_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "status" "public"."roles_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_status_enum"`);
  }
}
