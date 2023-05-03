import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedSeniorityLevelTable1670007123063
  implements MigrationInterface
{
  name = 'seedSeniorityLevelTable1670007123063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "seniority_levels" (name)
            VALUES ('Level 1'),
           ('Level 2'),
           ('Level 3'),
           ('Level 4'),
           ('Level 5'),
           ('Level 6'),
           ('Level 7')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "seniority_levels" CASCADE`);
  }
}
