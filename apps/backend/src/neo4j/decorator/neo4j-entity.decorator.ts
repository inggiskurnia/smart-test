import 'reflect-metadata';

export const NEO4J_ENTITY_KEY = Symbol('NEO4J_ENTITY');

export function Neo4jEntity(node: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(NEO4J_ENTITY_KEY, node, target);
    };
}

export function getNeo4jEntity(target: any): string {
    const metadata = Reflect.getMetadata(NEO4J_ENTITY_KEY, target);
    if (!metadata) {
        console.error('⚠️ Neo4jEntity metadata not found for:', target.name);
    }
    return metadata;
}