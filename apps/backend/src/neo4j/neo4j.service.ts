import { Inject, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { NEO4J_DRIVER, NEO4J_OPTIONS } from "./neo4j.provider";
import { Driver, Neo4jError, QueryResult, session, Session, Transaction } from "neo4j-driver";
import { INeo4jConnection } from "./interface/neo4j.connection";
import TransactionImpl from 'neo4j-driver-core/lib/transaction';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
    private readonly driver: Driver;
    private readonly config: INeo4jConnection
    @Inject(WINSTON_MODULE_PROVIDER) logger: Logger

    constructor(
        @Inject(NEO4J_DRIVER) driver: Driver,
        @Inject(NEO4J_OPTIONS) config: INeo4jConnection
    ) {
        this.driver = driver
        this.config = config
    }

    public getReadSession(database?: string, user?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.READ
        })
    }

    public getWriteSession(database?: string, user?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.WRITE
        })
    }

    public async read(
        cypher: string,
        params?: Record<string, any>,
        databaseOrTransaction?: string | Transaction,
        user?: string
    ): Promise<QueryResult> {
        if (databaseOrTransaction instanceof TransactionImpl) {
            return (<Transaction>databaseOrTransaction).run(cypher, params);
        }

        try {
            const session = this.getReadSession(<string>databaseOrTransaction, user);
            const res = await session.executeRead((tx) => tx.run(cypher, params));
            await session.close();
            return res;
        } catch (error) {
            this.logger.error(error);
            if (error instanceof Neo4jError) {
                throw error;
            } else {
                throw new Neo4jError(error.message, error.code, '', '');
            }
        }
    }

    public async write(
        cypher: string,
        params?: Record<string, any>,
        databaseOrTransaction?: string | Transaction,
        user?: string
    ): Promise<QueryResult> {
        if (databaseOrTransaction instanceof TransactionImpl) {
            return (<Transaction>databaseOrTransaction).run(cypher, params);
        }

        try {
            const session = this.getWriteSession(<string>databaseOrTransaction, user);
            const res = await session.executeWrite((tx) => tx.run(cypher, params));
            await session.close();
            return res;
        } catch (error) {
            this.logger.error(error);
            if (error instanceof Neo4jError) {
                throw error;
            } else {
                throw new Neo4jError(error.message, error.code, '', '');
            }
        }
    }

    onApplicationShutdown() {
        this.logger.warn('Neo4j closed');
        return this.driver.close();
    }
}