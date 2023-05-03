import { Injectable, NotFoundException } from '@nestjs/common';

import { AuthUser } from '@Auth/decorators';
import { RoleService } from '@Role/services';
import { User } from '@User/entities';
import { UserRepository } from '@User/repositories';

import { RoleDto } from '../dtos';

@Injectable()
export class InternalEndpointsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
  ) {}
  async changeRole(user: AuthUser, role: RoleDto): Promise<User> {
    const existingRole = await this.roleService.findOneBy({
      where: { name: role.role },
    });
    if (!existingRole) {
      throw new NotFoundException('Inexisting Role');
    }
    const updatedUser = this.userRepository.create({
      id: user.sub,
      email: user.username,
      role: existingRole,
    });
    return await this.userRepository.save(updatedUser);
  }
}
