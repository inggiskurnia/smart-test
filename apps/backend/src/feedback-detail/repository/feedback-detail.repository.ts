import { BaseRepository } from '../../shared/base_repository.impl';
import { FeedbackDetailEntity } from '../entities/feedback-detail.entity';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Neo4jService } from '../../neo4j/neo4j.service';

@Injectable()
export class FeedbackDetailRepository extends BaseRepository<
  FeedbackDetailEntity,
  string
> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) logger: Logger,
    neo4jService: Neo4jService,
  ) {
    super(logger, neo4jService, FeedbackDetailEntity);
  }
}
