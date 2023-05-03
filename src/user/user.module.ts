import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { RoleModule } from '@Role/role.module';
import { EvaluationRoleModule } from '@Evaluation-Role/evaluation-role.module';
import { SeniorityLevelModule } from '@Seniority-Level/seniority-level.module';
import { AuthModule } from '@Auth/auth.module';

import { UserRepository } from './repositories';
import { UserService } from './services';
import { UserController } from './controllers';
import { UserListener } from './listeners';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    SeniorityLevelModule,
    EvaluationRoleModule,
    RoleModule,
    AuthModule,
  ],
  providers: [UserService, JwtService, UserListener],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
