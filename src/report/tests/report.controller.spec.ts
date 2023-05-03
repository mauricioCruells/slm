import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';

import { ReportController } from '../controllers';
import { ReportService } from '../services';
import { ReportQueryDto } from '../dto';

describe('ReportController', () => {
  let reportController: ReportController;
  let reportService: DeepMocked<ReportService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: createMock<ReportService>(),
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue(createMock<JwtGuard>())
      .overrideGuard(AccessTokenGuard)
      .useValue(createMock<AccessTokenGuard>())
      .overrideGuard(RoleGuard)
      .useValue(createMock<RoleGuard>())
      .compile();

    reportController = module.get<ReportController>(ReportController);
    reportService = module.get(ReportService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reportController).toBeDefined();
  });

  it('should have a generate report endpoint', () => {
    expect(reportController.generate).toBeDefined();
  });

  describe('given generateReport()', () => {
    describe('when called without query params', () => {
      let report;

      beforeEach(async () => {
        report = await reportController.generate(createMock<ReportQueryDto>());
      });

      it('should call reportService generate method', () => {
        expect(reportService.generateInterviewees).toBeCalled();
      });
    });

    describe('when called with query params', () => {
      let report;
      const queryParams = createMock<ReportQueryDto>();
      beforeEach(async () => {
        report = await reportController.generate(queryParams);
      });

      it('should call reportService generate method', () => {
        expect(reportService.generateInterviewees).toBeCalled();
      });

      it('should pass query params to generate method', () => {
        expect(reportService.generateInterviewees).toBeCalledWith(queryParams);
      });
    });
  });
});
