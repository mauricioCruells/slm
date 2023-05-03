import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCategoryAndCategoryHistoryTables1679342205743
  implements MigrationInterface
{
  name = 'addCategoryAndCategoryHistoryTables1679342205743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories_history" ("id" SERIAL NOT NULL, "previous_name" character varying NOT NULL, "new_name" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL, "updated_by" integer NOT NULL, CONSTRAINT "PK_7afff73bfc69943e60a116d867f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories_history" ADD CONSTRAINT "FK_a32c364cd3cb295016f29a6f93c" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories_history" DROP CONSTRAINT "FK_a32c364cd3cb295016f29a6f93c"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "categories_history"`);
  }
}
