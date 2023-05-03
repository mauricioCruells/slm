import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TypeOrmExModule } from '@Config/typeorm-ex.module';
import { AuthModule } from '@Auth/auth.module';
import { EvaluationRoleModule } from '@Evaluation-Role/evaluation-role.module';

import { AssessmentController } from './controllers/';
import { AssessmentRepository } from './repositories';
import { AssessmentService } from './services/';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([AssessmentRepository]),
    AuthModule,
    EvaluationRoleModule,
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService, JwtService],
})
export class AssessmentModule {}
