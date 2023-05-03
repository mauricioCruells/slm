import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedCategoryTable1679342628533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "categories" (name) VALUES ('Quality Assurance'),
        ('Innovation & Experience Design'),
        ('Disruptive Techs'),
        ('Product'),
        ('PMO'),
        ('Development'),
        ('Cloud Engineering'),
        ('Data Engineering'),
        ('Cybersecurity')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "categories" CASCADE`);
  }
}
