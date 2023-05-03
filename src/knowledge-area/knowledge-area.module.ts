import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { AuthModule } from '@Auth/auth.module';

import { KnowledgeAreaRepository } from './repositories';
import { KnowledgeAreaService } from './services';
import { KnowledgeAreaController } from './controllers';
import { KnowledgeAreaListener } from './listeners';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([KnowledgeAreaRepository]),
    AuthModule,
  ],
  providers: [KnowledgeAreaService, JwtService, KnowledgeAreaListener],
  controllers: [KnowledgeAreaController],
  exports: [TypeOrmExModule, KnowledgeAreaService],
})
export class KnowledgeAreaModule {}
