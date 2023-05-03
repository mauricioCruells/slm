import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { AuthModule } from '@Auth/auth.module';

import { EvaluationRoleService } from './services';
import { EvaluationRoleController } from './controllers';
import { EvaluationRoleRepository } from './repositories';
import { EvaluationRoleHistory } from './entities';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([EvaluationRoleRepository]),
    TypeOrmModule.forFeature([EvaluationRoleHistory]),
    AuthModule,
  ],
  providers: [EvaluationRoleService, JwtService],
  controllers: [EvaluationRoleController],
  exports: [EvaluationRoleService],
})
export class EvaluationRoleModule {}
