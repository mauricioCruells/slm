import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { FilterDto, WhereNameFilter } from '@Core/dto';
import { notFoundByIdMessage } from '@Core/utils';

import { Role } from '../entities';
import { RoleRepository } from '../repositories';
import { UpdateRoleDto } from '../dtos';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  findOneBy(filter: FilterDto<WhereNameFilter>): Promise<Role> {
    return this.roleRepository.getOneBy(filter);
  }

  findAll() {
    return this.roleRepository.findRoles();
  }

  async findOneById(id: number) {
    const role = await this.roleRepository.getOneById(id);
    if (!role) {
      throw new NotFoundException(notFoundByIdMessage('platform role', id));
    }
    return role;
  }

  async updateOne(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOneById(id);
    const { alias, description } = updateRoleDto;
    if (alias) {
      const existingAlias = await this.roleRepository.getOneByAlias(alias);
      if (existingAlias) {
        throw new ConflictException(
          `There is already a platform role with alias ${alias}`,
        );
      }
      role.alias = alias;
    }
    if (description) {
      const existingDescription = await this.roleRepository.getOneByDescription(
        description,
      );
      if (existingDescription) {
        throw new ConflictException(
          `There is already a platform role with description ${description}`,
        );
      }
      role.description = description;
    }
    return await this.roleRepository.save(role);
  }
}
