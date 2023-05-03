import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';
import { TypeOrmExModule } from '@Config/typeorm-ex.module';

import { RoleService } from './services';
import { RoleRepository } from './repositories';
import { RoleController } from './controllers';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([RoleRepository]), AuthModule],
  controllers: [RoleController],
  providers: [RoleService, JwtService],
  exports: [RoleService],
})
export class RoleModule {}
