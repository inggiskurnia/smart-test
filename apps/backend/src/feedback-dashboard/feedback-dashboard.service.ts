import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Neo4jService } from '../neo4j/neo4j.service';
import { FeedbackDashboardResponseDto } from './dtos/feedback-dashboard-response.dto';

@Injectable()
export class FeedbackDashboardService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly neo4jService: Neo4jService,
  ) {}

  public async getDashboard(): Promise<FeedbackDashboardResponseDto> {
    this.logger.warn('get feedback dashboard', {
      context: FeedbackDashboardService.name,
    });

    const query = `
      MATCH (n:FeedbackDetail)
      WHERE coalesce(toInteger(n.deletedAt), 0) = 0
      WITH
        count(n) AS totalFeedback,
        count(CASE WHEN n.status = 'OPEN' THEN 1 END) AS issueOpen,
        count(CASE WHEN n.status = 'CLOSE' THEN 1 END) AS issueClose
      RETURN
        totalFeedback,
        issueOpen,
        issueClose,
        CASE
          WHEN totalFeedback = 0 THEN 0
          ELSE toInteger(round((toFloat(issueClose) / totalFeedback) * 100))
        END AS averageProgress
    `;

    const result = await this.neo4jService.read(query);
    const record = result.records[0];

    return plainToInstance(
      FeedbackDashboardResponseDto,
      {
        totalFeedback: this.toNumber(record?.get('totalFeedback')),
        issueOpen: this.toNumber(record?.get('issueOpen')),
        issueClose: this.toNumber(record?.get('issueClose')),
        averageProgress: Math.round(
          Number(record?.get('averageProgress') ?? 0),
        ),
      },
      { excludeExtraneousValues: true },
    );
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value?.toNumber === 'function') return value.toNumber();
    return Number(value);
  }
}
