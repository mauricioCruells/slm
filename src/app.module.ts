import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AssessmentModule } from '@Assessment/assessment.module';
import { UserModule } from '@User/user.module';
import { AuthModule } from '@Auth/auth.module';
import { SeniorityLevelModule } from '@Seniority-Level/seniority-level.module';
import { EvaluationRoleModule } from '@Evaluation-Role/evaluation-role.module';
import { KnowledgeAreaModule } from '@Knowledge-Area/knowledge-area.module';
import { CompetencyModule } from '@Competency/competency.module';
import { SkillModule } from '@Skill/skill.module';
import { TopicModule } from '@Topic/topic.module';
import { MasterFileModule } from '@Master-File/master-file.module';
import { QuestionModule } from '@Question/question.module';
import { OptionModule } from '@Option/option.module';
import { InternalEndpointsModule } from '@Internal-Endpoints/internal-endpoints.module';
import { ReportModule } from '@Report/report.module';
import { CategoryModule } from '@Category/category.module';
import { AssessmentHistoryModule } from '@AssessmentHistory/assessment-history.module';
import { S3FileModule } from '@S3File/s3-file.module';

import { typeORMAsyncConfig, validationSchema } from './config';
import { AppController } from './app.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    TypeOrmModule.forRootAsync(typeORMAsyncConfig),
    UserModule,
    AuthModule,
    SeniorityLevelModule,
    EvaluationRoleModule,
    KnowledgeAreaModule,
    CompetencyModule,
    SkillModule,
    TopicModule,
    InternalEndpointsModule,
    MasterFileModule,
    QuestionModule,
    OptionModule,
    MasterFileModule,
    AssessmentModule,
    ReportModule,
    CategoryModule,
    AssessmentHistoryModule,
    S3FileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
