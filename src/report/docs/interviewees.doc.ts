import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { IntervieweeDoc } from './interviewee.doc';

export class IntervieweesDoc {
  @ApiProperty({
    type: [IntervieweeDoc],
    example: [
      {
        id: 'number',
        employeeID: 'string',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        assessments: [{ id: 'number' }],
        completedAssessments: [{ id: 'number' }],
        evaluationRole: { id: 'number', name: 'string' },
        seniorityLevel: { id: 'number', name: 'string' },
        percentageOfCompletion: 'number',
      },
    ],
  })
  @Expose()
  interviewees: IntervieweeDoc[];
}
