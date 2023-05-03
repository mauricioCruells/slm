import { PartialType } from '@nestjs/swagger';

import { KnowledgeAreaDto } from './knowledge-area.dto';

export class UpdateKnowledgeAreaDto extends PartialType(KnowledgeAreaDto) {}
