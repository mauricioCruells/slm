import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';
import { CompetencyModule } from '@Competency/competency.module';
import { SkillModule } from '@Skill/skill.module';
import { TopicModule } from '@Topic/topic.module';
import { CategoryModule } from '@Category/category.module';
import { EvaluationRoleModule } from '@Evaluation-Role/evaluation-role.module';

import { MasterFileController } from './controllers/';
import { MasterFileService } from './services/';

@Module({
  imports: [
    CompetencyModule,
    SkillModule,
    TopicModule,
    CategoryModule,
    EvaluationRoleModule,
    AuthModule,
  ],
  controllers: [MasterFileController],
  providers: [MasterFileService, JwtService],
})
export class MasterFileModule {}
