const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  options: {
    'sonar.sources': './src',
  },
}, () => {}); 