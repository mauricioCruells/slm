import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';
import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { EvaluationRoleModule } from '@Evaluation-Role/evaluation-role.module';
import { KnowledgeAreaModule } from '@Knowledge-Area/knowledge-area.module';
import { SkillModule } from '@Skill/skill.module';

import { CompetencyController } from './controllers';
import { CompetencyListener } from './listeners';
import { CompetencyRepository } from './repositories';
import { CompetencyService } from './services';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([CompetencyRepository]),
    AuthModule,
    EvaluationRoleModule,
    KnowledgeAreaModule,
    SkillModule,
  ],
  controllers: [CompetencyController],
  providers: [CompetencyService, JwtService, CompetencyListener],
  exports: [TypeOrmExModule, CompetencyService],
})
export class CompetencyModule {}
