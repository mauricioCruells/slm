import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('General endpoints')
@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      data: {
        status: HttpStatus.OK,
        uptime: `${Math.floor(process.uptime())} s`,
        eventDate: new Date(),
        message: 'Back-end working properly',
      },
    };
  }
}
