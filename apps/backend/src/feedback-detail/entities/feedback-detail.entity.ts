import { FeedbackStatus } from '../enum/feedback-status.enum';
import { Exclude, Expose } from 'class-transformer';
import { Neo4jEntity } from '../../neo4j/decorator/neo4j-entity.decorator';

@Neo4jEntity('FeedbackDetail')
@Exclude()
export class FeedbackDetailEntity {
  @Expose()
  id: string;

  @Expose()
  periode: number;

  @Expose()
  controlSystem: string;

  @Expose()
  equipment: string;

  @Expose()
  problem: string;

  @Expose()
  solusi: string;

  @Expose()
  status: FeedbackStatus.OPEN;

  @Expose()
  progress: number;

  @Expose()
  createdAt: number = 0;

  @Expose()
  updatedAt: number = 0;

  @Expose()
  deletedAt: number = 0;
}
