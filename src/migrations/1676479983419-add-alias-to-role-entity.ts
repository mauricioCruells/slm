import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAliasToRoleEntity1676479983419 implements MigrationInterface {
  name = 'addAliasToRoleEntity1676479983419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "alias" character varying`,
    );
    await queryRunner.query(`UPDATE roles SET alias = 'Interviewee' WHERE
    name = 'Interviewee'`);
    await queryRunner.query(`UPDATE roles SET alias = 'Interviewer' WHERE
    name = 'Interviewer'`);
    await queryRunner.query(`UPDATE roles SET alias = 'Admin' WHERE
    name = 'Admin'`);
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN alias SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "alias"`);
  }
}
