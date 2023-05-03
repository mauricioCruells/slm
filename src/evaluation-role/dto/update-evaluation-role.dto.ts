import { PartialType } from '@nestjs/swagger';

import { EvaluationRoleDto } from './evaluation-role.dto';

export class UpdateEvaluationRoleDto extends PartialType(EvaluationRoleDto) {}
