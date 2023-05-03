import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { ReportRepository } from '../repositories';
import { ReportService } from '../services';
import { ReportQueryDto } from '@Report/dto';

describe('ReportService', () => {
  let reportService: ReportService;
  let reportRepository: DeepMocked<ReportRepository>;
  let eventEmitter: DeepMocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: ReportRepository,
          useValue: createMock<ReportRepository>(),
        },
        {
          provide: EventEmitter2,
          useValue: createMock<EventEmitter2>(),
        },
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
    reportRepository = module.get(ReportRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(reportService).toBeDefined();
  });

  it('should have a generate interviewees method', () => {
    expect(reportService.generateInterviewees).toBeDefined();
  });
});
