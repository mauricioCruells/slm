import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_LOGGING ? ['query'] : false,
  logger: 'file',
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*.js'],
  namingStrategy: new SnakeNamingStrategy(),
  ssl: process.env.HOST === 'heroku' ? { rejectUnauthorized: false } : false,
};

export default databaseConfig;
