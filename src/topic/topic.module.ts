import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { SkillModule } from '@Skill/skill.module';
import { SkillService } from '@Skill/services';
import { AuthModule } from '@Auth/auth.module';

import { TopicRepository } from './repositories';
import { TopicService } from './services';
import { TopicListener } from './listeners';
import { TopicController } from './controllers';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TopicRepository]),
    SkillModule,
    AuthModule,
  ],
  controllers: [TopicController],
  providers: [TopicService, TopicListener, SkillService, JwtService],
  exports: [TypeOrmExModule, TopicService],
})
export class TopicModule {}
