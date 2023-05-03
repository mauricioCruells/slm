import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLevelScoreColumnsInKnowledgeArea1679020124714
  implements MigrationInterface
{
  name = 'addLevelScoreColumnsInKnowledgeArea1679020124714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l1_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l1_upper_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l2_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l2_upper_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l3_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l3_upper_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l4_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l4_upper_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l5_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l5_upper_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l6_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l6_upper_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l7_lower_score" numeric(13,10) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" ADD "l7_upper_score" numeric(13,10) NOT NULL DEFAULT '100'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l7_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l7_lower_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l6_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l6_lower_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l5_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l5_lower_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l4_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l4_lower_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l3_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l3_lower_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l2_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l2_lower_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l1_upper_score"`,
    );
    await queryRunner.query(
      `ALTER TABLE "knowledge_areas" DROP COLUMN "l1_lower_score"`,
    );
  }
}
