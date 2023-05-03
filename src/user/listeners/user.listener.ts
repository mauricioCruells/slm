import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ReportQueryDto } from '@Report/dto';

import { UserService } from '../services';
import { User } from '../entities';

@Injectable()
export class UserListener {
  constructor(private readonly userService: UserService) {}

  @OnEvent('auth.getUserByEmail')
  async getUserByEmail(email: string): Promise<User> {
    return await this.userService.findOneByEmail({ email });
  }

  @OnEvent('auth.getOneUserById')
  @OnEvent('assessment.getOneUserById')
  @OnEvent('knowledge-area.getOneUserById')
  async getUserById(id: number): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @OnEvent('report.getManyUsersByQuery')
  async getUsersByQuery(reportQuery: ReportQueryDto) {
    return await this.userService.findManyForReport(reportQuery);
  }
}
