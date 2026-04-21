import { Config } from 'neo4j-driver';

export interface INeo4jConnection {
    host: string;
    username: string;
    password: string;
    database?: string;
    config?: Config
}