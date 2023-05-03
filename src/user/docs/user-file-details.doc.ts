import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UsersFileMessagesEnum } from '../enums';
import { FileStatusEnum } from '@Core/enums';

export class UserFileDetailsDoc {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  employeeID: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  platformRole: string;

  @ApiProperty()
  @Expose()
  evaluationRole: string;

  @ApiProperty()
  @Expose()
  seniorityLevel: string;

  @ApiProperty()
  @Expose()
  joiningDate: string;

  @ApiProperty()
  @Expose()
  result: FileStatusEnum;

  @ApiProperty()
  @Expose()
  details: UsersFileMessagesEnum[];
}
