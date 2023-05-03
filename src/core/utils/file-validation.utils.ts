import { BadRequestException } from '@nestjs/common';

export const csvFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(
      new BadRequestException('Only csv files are allowed.'),
      false,
    );
  }
  callback(null, true);
};

export const excelFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xls|xlsx)$/)) {
    return callback(
      new BadRequestException('Only xls and xlsx files are allowed.'),
      false,
    );
  }
  callback(null, true);
};
