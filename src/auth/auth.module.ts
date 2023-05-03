import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';

import { AuthListener } from './listeners';
import { AuthController } from './controllers';
import { AuthService, TokenService } from './services';
import { AzureADStrategy, JwtStrategy } from './strategies';
import { BlackListRepository, TokenRepository } from './repositories';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TokenRepository, BlackListRepository]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('ACCESS_TOKEN_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AzureADStrategy,
    JwtStrategy,
    AuthListener,
  ],
  exports: [TokenService, TypeOrmExModule],
})
export class AuthModule {}
