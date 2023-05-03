import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { KnowledgeAreaService } from '../services';
import { KnowledgeArea } from '../entities';

@Injectable()
export class KnowledgeAreaListener {
  constructor(private readonly knowledgeAreaService: KnowledgeAreaService) {}

  @OnEvent('assessment.findOneKAById')
  async findOneKAById(id: number): Promise<KnowledgeArea> {
    return await this.knowledgeAreaService.findOneById(id);
  }
}
