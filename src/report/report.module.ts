import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '@Auth/auth.module';

import { ReportController } from './controllers';
import { ReportService } from './services';
import { ReportRepository } from './repositories';

@Module({
  imports: [AuthModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository, JwtService],
})
export class ReportModule {}
