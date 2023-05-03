import { ReportQueryDto } from '../dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('ReportQueryDto', () => {
  describe('knowledgeAreaIds', () => {
    it('should validate and transform correctly for valid inputs', async () => {
      const input = { knowledgeAreaIds: '1,2,3' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.knowledgeAreaIds).toEqual([1, 2, 3]);
    });

    it('should omit non numbers and trailling commas', async () => {
      const input = { knowledgeAreaIds: '1,a,3,$' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.knowledgeAreaIds).toEqual([1, 3]);
    });

    it('should return an empty array when knowledgeAreaIds are not provided', async () => {
      const input = {};
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.knowledgeAreaIds).toEqual([]);
    });
  });

  describe('evaluationRoleIds', () => {
    it('should validate and transform correctly for valid inputs', async () => {
      const input = { evaluationRoleIds: '1,2,3' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.evaluationRoleIds).toEqual([1, 2, 3]);
    });

    it('should omit non numbers and trailling commas', async () => {
      const input = { evaluationRoleIds: '1,a,3,$,' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.evaluationRoleIds).toEqual([1, 3]);
    });

    it('should return an empty array when evaluationRoleIds are not provided', async () => {
      const input = {};
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.evaluationRoleIds).toEqual([]);
    });
  });

  describe('seniorityLevelIds', () => {
    it('should validate and transform correctly for valid inputs', async () => {
      const input = { seniorityLevelIds: '1,2,3' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.seniorityLevelIds).toEqual([1, 2, 3]);
    });

    it('should omit non numbers and trailling commas', async () => {
      const input = { seniorityLevelIds: '1,a,3,$,' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.seniorityLevelIds).toEqual([1, 3]);
    });

    it('should return an empty array when seniorityLevelIds are not provided', async () => {
      const input = {};
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.seniorityLevelIds).toEqual([]);
    });
  });

  describe('names', () => {
    it('should transform comma-separated names string into an array of names', async () => {
      const input = { names: 'John,Doe,Jane' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.names).toEqual(['John', 'Doe', 'Jane']);
    });

    it('should return an empty array when names are not provided', async () => {
      const input = {};
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.names).toEqual([]);
    });
  });

  describe('emails', () => {
    it('should transform comma-separated emails string into an array of emails', async () => {
      const input = {
        emails: 'john@example.com,doe@example.com,jane@example.com',
      };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.emails).toEqual([
        'john@example.com',
        'doe@example.com',
        'jane@example.com',
      ]);
    });

    it('should transform comma-separated partial email string into an array of filters', async () => {
      const input = { names: 'John,Doe,Jane' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.names).toEqual(['John', 'Doe', 'Jane']);
    });

    it('should return an empty array when emails are not provided', async () => {
      const input = {};
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.emails).toEqual([]);
    });
  });

  describe('ReportQueryDto sort transformation', () => {
    it('should parse valid sort options', async () => {
      const input = { sort: 'firstName,-lastName,email' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.sort).toEqual([
        { sortField: 'user.firstName', sortOrder: 'ASC' },
        { sortField: 'user.lastName', sortOrder: 'DESC' },
        { sortField: 'user.email', sortOrder: 'ASC' },
      ]);
    });

    it('should ignore invalid sort options', async () => {
      const input = { sort: 'firstName,-invalid,email' };
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.sort).toEqual([
        { sortField: 'user.firstName', sortOrder: 'ASC' },
        { sortField: 'user.email', sortOrder: 'ASC' },
      ]);
    });

    it('should return an empty array when sort is not provided', async () => {
      const input = {};
      const dto = plainToClass(ReportQueryDto, input);
      const validationErrors = await validate(dto);

      expect(validationErrors).toHaveLength(0);
      expect(dto.sort).toEqual([]);
    });
  });
});
