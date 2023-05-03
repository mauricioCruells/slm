import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedKnowledgeAreasToCategories1682713554800
  implements MigrationInterface
{
  private categoryToKnowledgeAreaMap = {
    'Quality Assurance': [
      {
        uid: 'KA-01',
        name: 'Functional',
        description: 'Functional test description',
      },
      {
        uid: 'KA-02',
        name: 'Automation',
        description: 'Automation test description',
      },
      {
        uid: 'KA-03',
        name: 'Non-Functional',
        description: 'Non-Functional test description',
      },
    ],
    'Innovation & Experience Design': [
      { uid: 'KA-04', name: 'UX', description: 'UX test description' },
      { uid: 'KA-05', name: 'UI', description: 'UI test description' },
      {
        uid: 'KA-06',
        name: 'Service Design',
        description: 'Service Design test description',
      },
      { uid: 'KA-07', name: 'CX', description: 'CX test description' },
    ],
    'Disruptive Techs': [
      {
        uid: 'KA-08',
        name: 'Machine Learning',
        description: 'Machine Learning test description',
      },
      {
        uid: 'KA-09',
        name: 'Deep Learning',
        description: 'Deep Learning test description',
      },
      {
        uid: 'KA-10',
        name: 'Blockchain',
        description: 'Blockchain test description',
      },
      {
        uid: 'KA-11',
        name: 'Data Science',
        description: 'Data Science test description',
      },
      { uid: 'KA-12', name: 'XR', description: 'XR test description' },
      {
        uid: 'KA-13',
        name: 'Automation',
        description: 'Automation test description',
      },
      { uid: 'KA-14', name: 'IoT', description: 'IoT test description' },
    ],
    Product: [
      {
        uid: 'KA-15',
        name: 'Product Management',
        description: 'Product Management test description',
      },
      { uid: 'KA-16', name: 'Agile', description: 'Agile test description' },
    ],
    PMO: [
      {
        uid: 'KA-17',
        name: 'Project Management',
        description: 'Project Management test description',
      },
      {
        uid: 'KA-18',
        name: 'PMO Specialist',
        description: 'PMO Specialist test description',
      },
    ],
    Development: [
      {
        uid: 'KA-19',
        name: 'Mobile Development',
        description: 'Mobile Development test description',
      },
      {
        uid: 'KA-20',
        name: 'Backend',
        description: 'Backend test description',
      },
      {
        uid: 'KA-21',
        name: 'Frontend',
        description: 'Frontend test description',
      },
      {
        uid: 'KA-22',
        name: 'Architecture',
        description: 'Architecture test description',
      },
    ],
    'Cloud Engineering': [
      {
        uid: 'KA-23',
        name: 'Cloud Native Technologies',
        description: 'Cloud Native Technologies test description',
      },
      { uid: 'KA-24', name: 'CI/CD', description: 'CI/CD test description' },
      { uid: 'KA-25', name: 'SRE', description: 'SRE test description' },
    ],
    'Data Engineering': [
      {
        uid: 'KA-26',
        name: 'Data Engineering',
        description: 'Data Engineering test description',
      },
      {
        uid: 'KA-27',
        name: 'Data Quality',
        description: 'Data Quality test description',
      },
      {
        uid: 'KA-28',
        name: 'Data Analytics',
        description: 'Data Analytics test description',
      },
    ],
    Maintenance: [
      {
        uid: 'KA-29',
        name: 'Support Maintenance L1',
        description: 'Support Maintenance L1 test description',
      },
    ],
    Cybersecurity: [
      {
        uid: 'KA-30',
        name: 'Auditing & Compliance',
        description: 'Auditing & Compliance test description',
      },
      {
        uid: 'KA-31',
        name: 'Vulnerability & penetration',
        description: 'Vulnerability & penetration test description',
      },
    ],
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    const categories = await queryRunner.query(
      `SELECT id, name FROM categories;`,
    );

    categories.forEach(async (category) => {
      try {
        this.categoryToKnowledgeAreaMap[category.name].forEach(
          async (knowledgeArea) => {
            await queryRunner.query(
              `INSERT INTO knowledge_areas (uid, name, description, category_id) VALUES ('${knowledgeArea.uid}', '${knowledgeArea.name}', '${knowledgeArea.description}', '${category.id}')`,
            );
          },
        );
      } catch (error) {
        console.error(
          `Error inserting knowledge areas for category ${category.name}: ${error}`,
        );
      }
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM knowledge_areas');
  }
}
