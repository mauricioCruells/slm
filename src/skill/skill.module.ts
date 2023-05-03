import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';
import { TypeOrmExModule } from '@Config/typeorm-ex.module';

import { SkillController } from './controllers';
import { SkillRepository } from './repositories';
import { SkillService } from './services';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([SkillRepository]), AuthModule],
  controllers: [SkillController],
  providers: [SkillService, JwtService],
  exports: [TypeOrmExModule, SkillService],
})
export class SkillModule {}
