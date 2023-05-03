export const sortDescription = `Default sort is firstName ascending and completion ascending, add minus sign to a sort to make it descending </br></br> 
      available sorts: 
        <ul>
          <li>firstName</li>
          <li>lastName</li>
          <li>email</li>
          <li>evaluationRole</li>
          <li>seniorityLevel</li>
          <li>completion</li>
        </ul>`;

export const sortExample = 'firstName,-evaluationRole';

export const evaluationRoleIdsDescription =
  'Ids of required EvaluationRoles, if blank returns all ';

export const evaluationRoleIdsExample = '5,4,7';

export const knowledgeAreaIdsDescription =
  'Ids of required KnowledgeAreas, if blank returns all';

export const knowledgeAreaIdsExample = '6,8,1,3';

export const namesDescription =
  'If looking for specific user(s) by first or last name, can filter multiple comma separated values and is case-insensitive';

export const namesExample = 'john,Cena,Andrew';

export const emailsDescription =
  'can filter multiple comma separated values and is case-insensitive,</br> can filter by passing just a partial string of an email';

export const emailsExample = 'johnny.b@something.com,gma';

export const seniorityLevelsDescription =
  'Ids of required seniorityLevels, if blank returns all';

export const seniorityLevelsExample = '2,7,3';

export const generateReportEPDescription =
  'Use this endpoint to generate a list of users with percentage of completed assessments </br> </br> if role is <b>interviewee</b> will only return own information';

export const generateReportEPSummary =
  'Create list of interviewees with filters and sort';
