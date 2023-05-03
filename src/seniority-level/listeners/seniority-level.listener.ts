import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { SeniorityLevel } from '../entities';
import { SeniorityLevelService } from '../services';

@Injectable()
export class SeniorityLevelListener {
  constructor(private readonly seniorityLevelService: SeniorityLevelService) {}

  @OnEvent('question.seniorityLevelId')
  async handleSeniorityLevel(id: number): Promise<SeniorityLevel> {
    const seniorityLevel = await this.seniorityLevelService.findOneById(id);

    return seniorityLevel;
  }
}
