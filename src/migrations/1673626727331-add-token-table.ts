import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTokenTable1673626727331 implements MigrationInterface {
  name = 'addTokenTable1673626727331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "access_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "expires_on" TIMESTAMP NOT NULL, "user_id" integer, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`,
    );
    await queryRunner.query(`DROP TABLE "token"`);
  }
}
