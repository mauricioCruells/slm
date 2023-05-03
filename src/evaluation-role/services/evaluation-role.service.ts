import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { notFoundByIdMessage, notFoundPluralMessage } from '@Core/utils';
import { PaginationDto } from '@Core/dto';

import { EvaluationRole } from '../entities';
import { EvaluationRoleRepository } from '../repositories';
import { EvaluationRoleDto, UpdateEvaluationRoleDto } from '../dto';

@Injectable()
export class EvaluationRoleService {
  constructor(
    private readonly evaluationRoleRepository: EvaluationRoleRepository,
  ) {}

  async findByIds(ids: number[]): Promise<EvaluationRole[]> {
    const evaluationRoles = await this.evaluationRoleRepository.findByIds(ids);

    if (!evaluationRoles.length)
      throw new NotFoundException(notFoundPluralMessage('evaluation roles'));

    if (ids.length === evaluationRoles.length) return evaluationRoles;

    const evaluationRolesIds = evaluationRoles.map(
      (evaluationRole) => evaluationRole.id,
    );

    const missingIds = ids.filter((id) => !evaluationRolesIds.includes(id));

    throw new NotFoundException(
      `Evaluation roles with IDs [${missingIds}] were not found`,
    );
  }

  findAll(pagination: PaginationDto): Promise<[EvaluationRole[], number]> {
    return this.evaluationRoleRepository.findAllRoles(pagination);
  }

  async create(evaluationRoleDto: EvaluationRoleDto): Promise<EvaluationRole> {
    const existingEvaluationRole =
      await this.evaluationRoleRepository.findOneBy({
        name: evaluationRoleDto.name,
      });

    if (existingEvaluationRole)
      throw new BadRequestException(
        `There is already an evaluation role with the name ${evaluationRoleDto.name}`,
      );

    return this.evaluationRoleRepository.save(evaluationRoleDto);
  }

  async update(
    id: number,
    updateEvaluationRoleDto: UpdateEvaluationRoleDto,
  ): Promise<EvaluationRole> {
    const evaluationRole = await this.evaluationRoleRepository.findOneBy({
      id,
    });
    if (!evaluationRole)
      throw new NotFoundException(notFoundByIdMessage('Evaluation role', id));
    const updatedEvaluationRole = {
      ...evaluationRole,
      ...updateEvaluationRoleDto,
    };
    return this.evaluationRoleRepository.save(updatedEvaluationRole);
  }

  async delete(id: number): Promise<void> {
    const evaluationRoleToDelete =
      await this.evaluationRoleRepository.findOneBy({
        id,
      });
    if (!evaluationRoleToDelete)
      throw new NotFoundException(notFoundByIdMessage('Evaluation role', id));
    await this.evaluationRoleRepository.remove(evaluationRoleToDelete);
  }

  async findManyByName(names: string[]): Promise<EvaluationRole[]> {
    return await this.evaluationRoleRepository.findManyByNames(names);
  }

  async findOneByName(name: string): Promise<EvaluationRole> {
    return await this.evaluationRoleRepository.findOneByName(name);
  }

  findByNames(names: string[]): Promise<EvaluationRole[]> {
    return this.evaluationRoleRepository.findManyByNames(names);
  }
}
