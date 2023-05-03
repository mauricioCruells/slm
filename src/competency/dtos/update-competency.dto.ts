import { PartialType } from '@nestjs/swagger';

import { CompetencyDto } from './competency.dto';

export class UpdateCompetencyDto extends PartialType(CompetencyDto) {}
