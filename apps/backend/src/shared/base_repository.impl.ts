import { Inject, Injectable } from '@nestjs/common';
import { IBaseRepository } from './base_repository.interface';
import { Neo4jService } from '../neo4j/neo4j.service';
import { getNeo4jEntity } from '../neo4j/decorator/neo4j-entity.decorator';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Node, ManagedTransaction } from 'neo4j-driver';
import { PageRequest } from '../helper/helper.api';
import { List } from './base';
import { Options } from './base-option';

/**
 * DO NOT EDITTED, EXTEND REPOSITORY IF YOU WANT TO IMPLEMENT ANOTHER METHOD
 */
@Injectable()
export abstract class BaseRepository<T, ID> implements IBaseRepository<T, ID> {
  protected node: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected logger: Logger,
    protected readonly neo4jService: Neo4jService,
    protected readonly entityClass: new (...args: any[]) => T,
  ) {
    this.node = getNeo4jEntity(entityClass);
  }

  protected mapToEntity(node: any): T {
    return plainToInstance(this.entityClass, node ?? {});
  }

  public async saveTx(entity: T, tx: ManagedTransaction): Promise<T> {
    const cypher = `MERGE (n:${this.node} {id: $id}) SET n += $props RETURN n as node`;
    const id = (entity as any).id;
    this.logger.warn(cypher, { context: 'neo4j' });
    const result = await tx.run(cypher, { id: id, props: entity });
    const savedEntity: Node = result.records[0].get('node');
    return this.mapToEntity(savedEntity.properties);
  }

  public async updateTx(
    id: ID,
    entity: T,
    tx: ManagedTransaction,
  ): Promise<void> {
    const cypher = `MATCH (n:${this.node}{id:$id}) SET n+=$entity return n as node`;
    this.logger.warn(cypher, { context: 'neo4j' });
    await tx.run(cypher, { id: id, entity: entity });
  }
  public async deleteTx(id: ID, tx: ManagedTransaction): Promise<void> {
    const cypher = `MATCH (n:${this.node}{id:$id}) SET n.deletedAt = datetime().epochMillis`;
    this.logger.warn(cypher, { context: 'neo4j' });
    await tx.run(cypher, { id: id });
  }

  public async findById(id: ID): Promise<T> {
    const cypher = `MATCH (n:${this.node}{id:$id}) RETURN n as node`;
    this.logger.info(cypher, { context: 'neo4j' });
    const result = await this.neo4jService.read(cypher, { id });
    if (!result.records.length) {
      return null;
    }
    const entity: Node = result.records[0].get('node');
    return this.mapToEntity(entity.properties);
  }

  public async save(entity: T): Promise<T> {
    const cypher = `MERGE (n:${this.node} {id: $id}) SET n += $props RETURN n as node`;
    const id = (entity as any).id;
    this.logger.warn(cypher, { context: 'neo4j' });
    const result = await this.neo4jService.write(cypher, { id, props: entity });
    const savedEntity: Node = result.records[0].get('node');
    return this.mapToEntity(savedEntity.properties);
  }

  public async findAll(
    filterSoftDelete?: boolean,
    options?: Options[],
    searchParam?: boolean,
  ): Promise<T[]> {
    const searchFilters: string[] = [];
    const fixedFilters: string[] = [];
    let filterDeleted: string = '';
    const params: Record<string, any> = {};

    if (filterSoftDelete) {
      filterDeleted += ' AND coalesce(toInteger(n.deletedAt), 0) > 0';
    } else if (!filterSoftDelete) {
      filterDeleted += ' AND coalesce(toInteger(n.deletedAt), 0) = 0';
    }

    if (options) {
      options.forEach((option) => {
        if (option.value) {
          if (searchParam && option.op === 'contains') {
            searchFilters.push(
              `toLower(n.${option.field}) ${option.op} toLower($${option.key ?? option.field})`,
            );
          } else if (
            option.op === '>=' ||
            option.op === '<=' ||
            option.op === '>' ||
            option.op === '<' ||
            option.op === '='
          ) {
            fixedFilters.push(
              `n.${option.field} ${option.op} $${option.key ?? option.field}`,
            );
          } else {
            fixedFilters.push(
              `toLower(n.${option.field}) ${option.op} toLower($${option.key ?? option.field})`,
            );
          }
          params[option.key ?? option.field] = option.value;
        }
      });
    }

    const searchFilterStr = searchFilters.length
      ? `(${searchFilters.join(' OR ')})`
      : '';

    const fixedFilterStr = fixedFilters.length
      ? `(${fixedFilters.join(' AND ')})`
      : '';

    let filtersAll = filterDeleted;
    if (searchFilterStr && fixedFilterStr) {
      filtersAll += ` AND ${searchFilterStr} AND ${fixedFilterStr}`;
    } else if (searchFilterStr) {
      filtersAll += ` AND ${searchFilterStr}`;
    } else if (fixedFilterStr) {
      filtersAll += ` AND ${fixedFilterStr}`;
    }

    const query = `MATCH (n:${this.node}) WHERE (1=1) ${filtersAll} RETURN n as node ORDER by node.id desc`;
    this.logger.info(query, { context: 'neo4j' });
    const result = await this.neo4jService.read(query, params);

    if (!result.records.length) return [];

    return result.records.map((record) => {
      const entity: Node = record.get('node');
      return this.mapToEntity(entity.properties);
    });
  }

  public async findAllWithPagination(
    pageRequest: PageRequest,
    filterSoftDelete?: boolean,
    options?: Options[],
    searchParam?: boolean,
  ): Promise<List<T>> {
    const searchFilters: string[] = [];
    const fixedFilters: string[] = [];
    let filterDeleted: string = '';
    let pagination: string = '';
    const params: Record<string, any> = {};

    if (
      pageRequest.limit !== undefined &&
      pageRequest.limit !== null &&
      pageRequest.skip !== undefined &&
      pageRequest.skip !== null
    ) {
      pagination = ` SKIP ${pageRequest.skip} LIMIT ${pageRequest.limit}`;
    }

    if (filterSoftDelete) {
      filterDeleted += ' AND coalesce(toInteger(n.deletedAt), 0) > 0';
    } else if (!filterSoftDelete) {
      filterDeleted += ' AND coalesce(toInteger(n.deletedAt), 0) = 0';
    }

    if (options) {
      options.forEach((option) => {
        if (option.value) {
          if (searchParam && option.op === 'contains') {
            searchFilters.push(
              `toLower(n.${option.field}) ${option.op} toLower($${option.key ?? option.field})`,
            );
          } else if (
            option.op === '>=' ||
            option.op === '<=' ||
            option.op === '>' ||
            option.op === '<' ||
            option.op === '='
          ) {
            fixedFilters.push(
              `n.${option.field} ${option.op} $${option.key ?? option.field}`,
            );
          } else {
            fixedFilters.push(
              `toLower(n.${option.field}) ${option.op} toLower($${option.key ?? option.field})`,
            );
          }
          params[option.key ?? option.field] = option.value;
        }
      });
    }

    const searchFilterStr = searchFilters.length
      ? `(${searchFilters.join(' OR ')})`
      : '';

    const fixedFilterStr = fixedFilters.length
      ? `(${fixedFilters.join(' AND ')})`
      : '';

    let filtersAll = filterDeleted;
    if (searchFilterStr && fixedFilterStr) {
      filtersAll += ` AND ${searchFilterStr} AND ${fixedFilterStr}`;
    } else if (searchFilterStr) {
      filtersAll += ` AND ${searchFilterStr}`;
    } else if (fixedFilterStr) {
      filtersAll += ` AND ${fixedFilterStr}`;
    }

    const query = `MATCH (n:${this.node}) WHERE (1=1) ${filtersAll} RETURN n as node ORDER by node.id desc ${pagination}`;
    const queryCount = `MATCH (n:${this.node}) WHERE (1=1) ${filtersAll} RETURN COUNT(n) as total`;
    this.logger.info(query, { context: 'neo4j' });
    const [result, total_result] = await Promise.all([
      this.neo4jService.read(query, params),
      this.neo4jService.read(queryCount, params),
    ]);

    if (!result.records.length) return { results: [], totalData: 0 };

    const total_data = total_result.records[0].get('total');
    const data = result.records.map((record) => {
      const entityData: Node = record.get('node');
      return this.mapToEntity(entityData.properties);
    });

    return {
      results: data,
      totalData: total_data,
    };
  }

  public async findByIdTx(id: ID, tx: ManagedTransaction): Promise<T> {
    const cypher = `MATCH (n:${this.node}{id:$id}) RETURN n as node`;
    this.logger.info(cypher, { context: 'neo4j' });
    const result = await tx.run(cypher, { id });
    if (!result.records.length) {
      return null;
    }
    const entity: Node = result.records[0].get('node');
    return this.mapToEntity(entity.properties);
  }

  public async update(id: ID, entity: T): Promise<T> {
    const cypher = `MATCH (n:${this.node}{id:$id}) SET n+=$entity return n as node`;
    this.logger.warn(cypher, { context: 'neo4j' });
    const result = await this.neo4jService.write(cypher, {
      id: id,
      entity: entity,
    });
    const updatedEntity: Node = result.records[0].get('node');
    return this.mapToEntity(updatedEntity.properties);
  }
  public async delete(id: ID): Promise<void> {
    const cypher = `MATCH (n:${this.node}{id:$id}) SET n.deletedAt = timestamp() / 1000`;
    this.logger.warn(cypher, { context: 'neo4j' });
    await this.neo4jService.write(cypher, { id });
    return;
  }
}
