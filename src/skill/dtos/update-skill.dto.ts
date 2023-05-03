import { PartialType } from '@nestjs/swagger';
import { SkillDto } from './skill.dto';

export class UpdateSkillDto extends PartialType(SkillDto) {}
