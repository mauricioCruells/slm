import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateOptionDto } from '../dto';
import { Option } from '../entities';
import { OptionService } from '../services';

@Injectable()
export class OptionListener {
  constructor(private readonly optionService: OptionService) {}

  @OnEvent('question.createOption')
  async createOption(createOptionDto: CreateOptionDto): Promise<Option> {
    return await this.optionService.create(createOptionDto);
  }
}
