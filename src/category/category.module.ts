import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { AuthModule } from '@Auth/auth.module';
import { KnowledgeAreaModule } from '@Knowledge-Area/knowledge-area.module';

import { CategoryRepository } from './repositories';
import { CategoryController } from './controllers';
import { CategoryService } from './services';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([CategoryRepository]),
    AuthModule,
    KnowledgeAreaModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
  exports: [TypeOrmExModule, CategoryService],
})
export class CategoryModule {}
