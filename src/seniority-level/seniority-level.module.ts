import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { AuthModule } from '@Auth/auth.module';

import { SeniorityLevelRepository } from './repositories';
import { SeniorityLevelService } from './services';
import { SeniorityLevelListener } from './listeners';
import { SeniorityLevelController } from './controllers';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([SeniorityLevelRepository]),
    AuthModule,
  ],
  providers: [SeniorityLevelService, SeniorityLevelListener, JwtService],
  exports: [SeniorityLevelService],
  controllers: [SeniorityLevelController],
})
export class SeniorityLevelModule {}
