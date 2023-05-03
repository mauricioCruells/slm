import { Assessment } from '@Assessment/entities';
import { AssessmentHistory } from '@AssessmentHistory/entities';
import { User } from '@User/entities';

export const assessmentHistoryMock: AssessmentHistory = {
  id: 0,
  assessment: new Assessment(),
  action: 'action',
  date: new Date(),
  executedBy: new User(),
};
