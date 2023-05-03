import { BadRequestException, ConflictException } from '@nestjs/common';

import { FileStatusEnum } from '../enums';

export const returnFileDetailsOrThrowException = (
  fileDetails,
  pluralEntityName: string,
) => {
  const noDataSaved = fileDetails.every(
    (data) => data.result === FileStatusEnum.ERROR,
  );
  if (noDataSaved) {
    throw new BadRequestException({
      message: `No ${pluralEntityName} could be added`,
      data: fileDetails,
    });
  }
  const atLeastOneSaved = fileDetails.some(
    (data) => data.result === FileStatusEnum.ERROR,
  );
  if (atLeastOneSaved) {
    throw new ConflictException({
      message: `Some ${pluralEntityName} could not be added`,
      data: fileDetails,
    });
  }
  return fileDetails;
};
