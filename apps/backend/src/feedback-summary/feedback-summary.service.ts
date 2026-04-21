import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Neo4jService } from '../neo4j/neo4j.service';
import { GetFeedbackSummaryListDto } from './dtos/get-feedback-summary-list.dto';
import { FeedbackSummaryResponseDto } from './dtos/feedback-summary-response.dto';

@Injectable()
export class FeedbackSummaryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly neo4jService: Neo4jService,
  ) {}

  public async getPaginatedList(request: GetFeedbackSummaryListDto) {
    this.logger.warn('get paginated list feedback summary', {
      context: FeedbackSummaryService.name,
      request,
    });

    const skip = Math.max(0, (request.page - 1) * request.size);
    const limit = Math.max(1, request.size);

    const query = `
      MATCH (n:FeedbackDetail)
      WHERE coalesce(toInteger(n.deletedAt), 0) = 0
      WITH
        n.periode AS periode,
        n.controlSystem AS controlSystem,
        count(n) AS totalFeedback,
        count(CASE WHEN n.status = 'OPEN' THEN 1 END) AS issueOpen,
        count(CASE WHEN n.status = 'CLOSE' THEN 1 END) AS issueClosed
      RETURN
        toString(periode) AS periode,
        controlSystem,
        totalFeedback,
        issueOpen,
        issueClosed,
        CASE
          WHEN totalFeedback = 0 THEN 0
          ELSE toInteger(round((toFloat(issueClosed) / totalFeedback) * 100))
        END AS progress
      ORDER BY periode DESC, controlSystem ASC
      SKIP ${skip} LIMIT ${limit}
    `;

    const countQuery = `
      MATCH (n:FeedbackDetail)
      WHERE coalesce(toInteger(n.deletedAt), 0) = 0
      WITH n.periode AS periode, n.controlSystem AS controlSystem
      RETURN count(*) AS total
    `;

    const [result, totalResult] = await Promise.all([
      this.neo4jService.read(query),
      this.neo4jService.read(countQuery),
    ]);

    const totalData = this.toNumber(totalResult.records[0]?.get('total'));
    const data = result.records.map((record) =>
      plainToInstance(
        FeedbackSummaryResponseDto,
        {
          periode: record.get('periode'),
          controlSystem: record.get('controlSystem'),
          totalFeedback: this.toNumber(record.get('totalFeedback')),
          issueOpen: this.toNumber(record.get('issueOpen')),
          issueClosed: this.toNumber(record.get('issueClosed')),
          progress: Math.round(Number(record.get('progress') ?? 0)),
        },
        { excludeExtraneousValues: true },
      ),
    );

    return { data, totalData };
  }

  private toNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value?.toNumber === 'function') return value.toNumber();
    return Number(value);
  }
}
