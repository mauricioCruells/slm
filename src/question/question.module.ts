import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';
import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { SeniorityLevelModule } from '@Seniority-Level/seniority-level.module';
import { TopicModule } from '@Topic/topic.module';
import { UserModule } from '@User/user.module';
import { SkillModule } from '@Skill/skill.module';
import { S3FileModule } from '@S3File/s3-file.module';

import { QuestionController } from './controllers';
import { QuestionRepository } from './repositories';
import { QuestionService } from './services';

@Module({
  imports: [
    UserModule,
    SeniorityLevelModule,
    TopicModule,
    AuthModule,
    SkillModule,
    S3FileModule,
    TypeOrmExModule.forCustomRepository([QuestionRepository]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService, JwtService],
  exports: [QuestionService],
})
export class QuestionModule {}
