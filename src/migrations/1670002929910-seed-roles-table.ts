import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedRolesTable1670002929910 implements MigrationInterface {
  name = 'seedRolesTable1670002929910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "roles" (name, description)
        VALUES ('Interviewee', 'SLM Role for interviewees'),
       ('Interviewer', 'SLM Role for interviewers'),
       ('Admin', 'SLM Role for admins')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "roles" CASCADE`);
  }
}
