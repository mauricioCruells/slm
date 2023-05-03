import { parse } from 'papaparse';
import { Readable } from 'stream';

export const retrieveDataFromCsvFile = async (file: Express.Multer.File) => {
  const stream = Readable.from(file.buffer);
  const results = [];
  await new Promise((resolve, reject) => {
    parse(stream, {
      header: true,
      worker: true,
      delimiter: ',',
      transformHeader: (header) => header.trim(),
      step: (row) => {
        results.push(row.data);
      },
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
  return results;
};
