import { MigrationInterface, QueryRunner } from 'typeorm';

export class ammendKnowledgeAreaSeed1683059333791
  implements MigrationInterface
{
  private categoryToKnowledgeAreaMapAmmend = {
    'Cloud Engineering': [
      {
        uid: 'KA-32',
        name: 'Cloud Security',
        description: 'Cloud Security test description',
      },
    ],
  };
  public async up(queryRunner: QueryRunner): Promise<void> {
    const category = await queryRunner.query(
      `SELECT id, name FROM categories WHERE name = 'Cloud Engineering';`,
    );

    const knowledgeArea =
      this.categoryToKnowledgeAreaMapAmmend[category[0].name];

    await queryRunner.query(
      `INSERT INTO knowledge_areas (uid, name, description, category_id) VALUES ('${knowledgeArea[0].uid}', '${knowledgeArea[0].name}', '${knowledgeArea[0].description}', '${category[0].id}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM knowledge_areas WHERE name = 'Cloud Security'`,
    );
  }
}
