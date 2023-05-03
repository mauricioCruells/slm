import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';
import { QuestionModule } from '@Question/question.module';
import { TypeOrmExModule } from '@Config/typeorm-ex.module';

import { OptionRepository } from './repositories';
import { OptionService } from './services/';
import { OptionController } from './controllers/';
import { OptionListener } from './listeners';

@Module({
  imports: [
    QuestionModule,
    AuthModule,
    TypeOrmExModule.forCustomRepository([OptionRepository]),
  ],
  providers: [OptionService, JwtService, OptionListener],
  controllers: [OptionController],
  exports: [OptionService],
})
export class OptionModule {}
