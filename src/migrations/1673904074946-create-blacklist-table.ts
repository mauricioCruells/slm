import { MigrationInterface, QueryRunner } from 'typeorm';

export class createBlacklistTable1673904074946 implements MigrationInterface {
  name = 'createBlacklistTable1673904074946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blacklist" ("id" SERIAL NOT NULL, "uti" character varying NOT NULL, CONSTRAINT "PK_04dc42a96bf0914cda31b579702" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "blacklist"`);
  }
}
