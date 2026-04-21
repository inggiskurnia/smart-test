import * as dotenv from 'dotenv';
import { resolve } from 'path';

const testEnvPath = resolve(__dirname, '..', '.env.test');
const testEnv = dotenv.config({ path: testEnvPath, override: true });

if (testEnv.error) {
  throw testEnv.error;
}

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

const requiredTestEnv = ['NODE_ENV', 'APP_ENV', 'NEO4J_HOST', 'NEO4J_DATABASE'];

for (const key of requiredTestEnv) {
  if (!testEnv.parsed?.[key]) {
    throw new Error(`Missing required ${key} in ${testEnvPath}`);
  }
}

if (process.env.NODE_ENV !== 'test') {
  throw new Error(
    `Refusing to run smoke test with NODE_ENV=${process.env.NODE_ENV ?? 'undefined'}`,
  );
}

if (process.env.APP_ENV !== 'test') {
  throw new Error(
    `Refusing to run smoke test with APP_ENV=${process.env.APP_ENV ?? 'undefined'}`,
  );
}

const neo4jHost = process.env.NEO4J_HOST ?? '';
const neo4jDatabase = process.env.NEO4J_DATABASE ?? '';
const blockedHostPatterns = [
  'industropolisbatang',
  'prod',
  'production',
  'staging',
];

if (blockedHostPatterns.some((pattern) => neo4jHost.includes(pattern))) {
  throw new Error(
    `Refusing to run tests against unsafe Neo4j host: ${neo4jHost}`,
  );
}

if (
  !/(localhost|127\.0\.0\.1|:\/\/neo4j(?::\d+)?$|_test$|-test$)/i.test(
    neo4jHost,
  )
) {
  throw new Error(
    `Refusing to run tests with non-test Neo4j host: ${neo4jHost}`,
  );
}

if (/(prod|production|staging)/i.test(neo4jDatabase)) {
  throw new Error(
    `Refusing to run tests with non-test Neo4j database: ${neo4jDatabase}`,
  );
}

describe('Smoke test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('boots the application', () => {
    expect(app).toBeDefined();
  });
});
