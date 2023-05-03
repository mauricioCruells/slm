import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Competency } from '../entities';
import { CompetencyService } from '../services';

@Injectable()
export class CompetencyListener {
  constructor(private readonly competencyService: CompetencyService) {}

  @OnEvent('knowledge-area.competenciesIds')
  async handleCompetenciesById(
    ids: number[],
    knowledgeAreaId: number,
  ): Promise<Competency[]> {
    const competencies = await this.competencyService.findByIds(ids);

    const competenciesBelonged = competencies.reduce((acc, competency) => {
      if (
        competency.knowledgeArea &&
        competency.knowledgeArea.id !== knowledgeAreaId
      )
        acc += `${competency.name}, `;
      return acc;
    }, '');

    const improvedMessage = competenciesBelonged.substring(
      0,
      competenciesBelonged.length - 2,
    );

    if (competenciesBelonged.length)
      throw new BadRequestException(
        `The following competencies: [${improvedMessage}] already belong to another Knowledge Area`,
      );

    return competencies;
  }

  @OnEvent('skill.competency')
  async handleCompetencyById(id: number): Promise<Competency> {
    const competency = await this.competencyService.findOneById(id);
    return competency;
  }
}
