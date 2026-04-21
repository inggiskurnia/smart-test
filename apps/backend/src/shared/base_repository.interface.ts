import { ManagedTransaction } from 'neo4j-driver';
import { PageRequest } from '../helper/helper.api';
import { List } from './base';
import { Options } from './base-option';

export interface IBaseRepository<T, ID> {
  findById(id: ID): Promise<T | null>;

  save(entity: T): Promise<T>;

  saveTx(entity: T, tx: ManagedTransaction): Promise<T>;

  findAll(isDeleted?: boolean, options?: Options[]): Promise<T[]>;

  findAllWithPagination(
    pageRequest: PageRequest,
    isDeleted?: boolean,
    options?: Options[],
  ): Promise<List<T>>;

  update(id: ID, entity: T): Promise<T>;

  updateTx(id: ID, entity: T, tx: ManagedTransaction): Promise<void>;

  delete(id: ID): Promise<void>;

  deleteTx(id: ID, tx: ManagedTransaction): Promise<void>;
}
