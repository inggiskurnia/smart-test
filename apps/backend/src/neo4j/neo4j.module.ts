import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NEO4J_DRIVER, NEO4J_OPTIONS } from './neo4j.provider';
import { ConfigEnvironment } from '../config/config.environment';
import { INeo4jConnection } from './interface/neo4j.connection';
import { createDriver } from './util/connection';
import { Neo4jService } from './neo4j.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Module({})
export class Neo4jModule {
  static fromEnv(): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      providers: [
        {
          provide: NEO4J_OPTIONS,
          inject: [ConfigEnvironment],
          useFactory: (config: ConfigEnvironment): INeo4jConnection => ({
            host: config.neo4jHost,
            username: config.neo4jUser,
            password: config.neo4jPassword,
            database: config.neo4jDatabase,
            config: {
              disableLosslessIntegers: config.neo4jLossInteger,
              useBigInt: config.neo4jUseBigInt,
            },
          }),
        } as Provider<any>,
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_OPTIONS, WINSTON_MODULE_PROVIDER],
          useFactory: async (config: INeo4jConnection, logger: Logger) =>
            createDriver(config, logger),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}
