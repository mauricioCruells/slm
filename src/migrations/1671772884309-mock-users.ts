import { MigrationInterface, QueryRunner } from 'typeorm';

export class mockUsers1671772884309 implements MigrationInterface {
  name = 'mockUsers1671772884309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO users (employee_id, first_name, last_name, email, joining_date) VALUES ('TestID', 'John', 'Doe', 'jdoe@applaudostudios.com', '2022-12-22')`,
    );
    await queryRunner.query(
      `INSERT INTO users (employee_id, first_name, last_name, email, joining_date) VALUES ('TestID2', 'John Jr', 'Doe', 'jrdoe@applaudostudios.com', '2022-12-23')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE employee_id = 'TestID' OR employee_id = 'TestID2'`,
    );
  }
}
