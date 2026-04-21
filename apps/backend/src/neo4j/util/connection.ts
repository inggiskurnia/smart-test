import { auth, driver, Driver } from 'neo4j-driver';
import { INeo4jConnection } from '../interface/neo4j.connection';
import { Logger } from 'winston';

export const createDriver = async (
  connection: INeo4jConnection,
  logger: Logger,
): Promise<Driver> => {
  const connectionDriver: Driver = driver(
    `${connection.host}`,
    auth.basic(connection.username, connection.password),
    connection.config,
  );

  try {
    await connectionDriver.getServerInfo();
    logger.info('Neo4j Connected', {
      context: 'Neo4jConnection',
      host: connection.host,
      database: connection.database,
    });
    return connectionDriver;
  } catch (err: any) {
    logger.error('Neo4j connect failed', {
      context: 'Neo4jConnection',
      host: connection.host,
      database: connection.database,
      errorMessage: err?.message,
      stack: err?.stack,
    });
    throw err;
  }
};
