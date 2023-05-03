import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { RoleModule } from '@Role/role.module';
import { UserRepository } from '@User/repositories';
import { AuthModule } from '@Auth/auth.module';

import { InternalEndpointsController } from './controllers';
import { InternalEndpointsService } from './services';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    RoleModule,
    AuthModule,
  ],
  controllers: [InternalEndpointsController],
  providers: [InternalEndpointsService, JwtService],
})
export class InternalEndpointsModule {}
