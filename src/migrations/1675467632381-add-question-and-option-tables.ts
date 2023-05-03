import { MigrationInterface, QueryRunner } from 'typeorm';

export class addQuestionAndOptionTables1675467632381
  implements MigrationInterface
{
  name = 'addQuestionAndOptionTables1675467632381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "option" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "question_id" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_type_enum" AS ENUM('Multiple Choice', 'Short Response', 'Long Response', 'Upload a file')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "description" character varying NOT NULL, "type" "public"."questions_type_enum" NOT NULL DEFAULT 'Multiple Choice', "score" integer NOT NULL, "time" integer NOT NULL, "weight" integer NOT NULL, "correct_answer_id" integer NOT NULL, "is_active" boolean NOT NULL, "last_updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "level_id" integer, "author_id" integer, "topic_id" integer, CONSTRAINT "REL_97cb5a1d1eea1692c817d7e514" UNIQUE ("level_id"), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" ADD CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147" FOREIGN KEY ("level_id") REFERENCES "seniority_levels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_dcaac7adf4b5af7bc980ec5250e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_e29a77ea64df3fb567c4c200a9e" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_e29a77ea64df3fb567c4c200a9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_dcaac7adf4b5af7bc980ec5250e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_97cb5a1d1eea1692c817d7e5147"`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" DROP CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b"`,
    );
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
    await queryRunner.query(`DROP TABLE "option"`);
  }
}
