import { Injectable, NotFoundException } from '@nestjs/common';

import { QuestionService } from '@Question/services';
import { notFoundByIdMessage } from '@Core/utils';

import { CreateOptionDto, UpdateOptionDto } from '../dto';
import { OptionRepository } from '../repositories';
import { Option } from '../entities';

@Injectable()
export class OptionService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly optionRepository: OptionRepository,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const { questionId, ...optionBody } = createOptionDto;
    const question = await this.questionService.findOne(questionId);
    const savedOption = await this.optionRepository.save({
      question,
      ...optionBody,
    });
    return savedOption;
  }

  async update(id: number, updateOptionDto: UpdateOptionDto): Promise<Option> {
    const option = await this.optionRepository.getOneById(id);
    if (!option) throw new NotFoundException(notFoundByIdMessage('Option', id));
    if (updateOptionDto.isCorrect !== undefined)
      option.isCorrect = updateOptionDto.isCorrect;
    if (updateOptionDto.value) option.value = updateOptionDto.value;

    return await this.optionRepository.save(option);
  }
}
