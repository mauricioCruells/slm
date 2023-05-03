import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { CompetencyRepository } from '@Competency/repositories';
import { KnowledgeAreaRepository } from '@Knowledge-Area/repositories';
import { SkillRepository } from '@Skill/repositories';
import { TopicRepository } from '@Topic/repositories';
import { QuestionRepository } from '@Question/repositories';
import { AuthModule } from '@Auth/auth.module';

import { AssessmentHistoryListener } from './listeners';
import {
  AssessmentHistoryListenerService,
  AssessmentHistoryService,
} from './services';
import { AssessmentHistoryRepository } from './repositories';
import { AssessmentHistoryController } from './controllers';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      AssessmentHistoryRepository,
      CompetencyRepository,
      KnowledgeAreaRepository,
      SkillRepository,
      TopicRepository,
      QuestionRepository,
    ]),
    AuthModule,
  ],
  controllers: [AssessmentHistoryController],
  providers: [
    AssessmentHistoryService,
    AssessmentHistoryListenerService,
    AssessmentHistoryListener,
    JwtService,
  ],
  exports: [TypeOrmExModule],
})
export class AssessmentHistoryModule {}
