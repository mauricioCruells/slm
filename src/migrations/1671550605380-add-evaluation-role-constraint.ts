import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEvaluationRoleConstraint1671550605380
  implements MigrationInterface
{
  name = 'addEvaluationRoleConstraint1671550605380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles" ADD CONSTRAINT "UQ_ee0441318b011b4014d48262db7" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "evaluation_roles" DROP CONSTRAINT "UQ_ee0441318b011b4014d48262db7"`,
    );
  }
}
