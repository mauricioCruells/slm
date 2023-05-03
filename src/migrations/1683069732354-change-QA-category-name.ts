import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeQACategoryName1683069732354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE categories SET name = 'Quality Engineering' WHERE name = 'Quality Assurance'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE categories SET name = 'Quality Assurance' WHERE name = 'Quality Engineering'`,
    );
  }
}
