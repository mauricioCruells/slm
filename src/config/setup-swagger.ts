import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerDoc(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SLM')
    .setDescription('A platform designed and developed by Applaudo talent.')
    .setVersion('0.1')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
}
