import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSeniorityLevelTable1670006946988 implements MigrationInterface {
  name = 'addSeniorityLevelTable1670006946988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seniority_levels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9eaffcfa0034123bdbf2bd3b9a2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "seniority_levels"`);
  }
}
