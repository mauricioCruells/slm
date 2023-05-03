import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { EvaluationRoleDoc } from '@Evaluation-Role/docs';
import { AssessmentDoc } from '@Assessment/docs';
import { SeniorityLevelDoc } from '@Seniority-Level/docs';

export class IntervieweeDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  employeeID: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  evaluationRole: EvaluationRoleDoc;

  @ApiProperty()
  @Expose()
  seniorityLevel: SeniorityLevelDoc;

  @ApiProperty()
  @Expose()
  assessments: AssessmentDoc[];

  @ApiProperty()
  @Expose()
  completedAssessments: AssessmentDoc[];

  @ApiProperty()
  @Expose()
  percentageOfCompletion: number;
}
