// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.service.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@Assessment/(.*)': '<rootDir>/assessment/$1',
    '@Question/(.*)': '<rootDir>/question/$1',
    '@Option/(.*)': '<rootDir>/option/$1',
    '@Core/(.*)': '<rootDir>/core/$1',
    '@Config/(.*)': '<rootDir>/config/$1',
    '@Seniority-Level/(.*)': '<rootDir>/seniority-level/$1',
    '@User/(.*)': '<rootDir>/user/$1',
    '@Role/(.*)': '<rootDir>/role/$1',
    '@Evaluation-Role/(.*)': '<rootDir>/evaluation-role/$1',
    '@Auth/(.*)': '<rootDir>/auth/$1',
    '@Competency/(.*)': '<rootDir>/competency/$1',
    '@Knowledge-Area/(.*)': '<rootDir>/knowledge-area/$1',
    '@Skill/(.*)': '<rootDir>/skill/$1',
    '@Topic/(.*)': '<rootDir>/topic/$1',
    '@Common/(.*)': '<rootDir>/common/$1',
    '@Report/(.*)': '<rootDir>/report/$1',
    '@Category/(.*)': '<rootDir>/category/$1',
    '@AssessmentHistory/(.*)': '<rootDir>/assessment-history/$1',
    '@S3File/(.*)': '<rootDir>/s3-file/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
