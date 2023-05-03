import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { ExampleFilesSlug } from '@Core/enums';

import { S3CommonFiles } from '../entities';

@CustomRepository(S3CommonFiles)
export class S3CommonFilesRepository extends Repository<S3CommonFiles> {
  async findOneBySlug(slug: ExampleFilesSlug | string): Promise<S3CommonFiles> {
    return this.findOne({ where: { slug } });
  }
}
