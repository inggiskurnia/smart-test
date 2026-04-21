import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiOkEnvelope } from '../decorators/api-envelope.decorator';
import { ApiResponse } from '../shared/api-response';
import { PaginationMeta } from '../shared/pagination-meta';
import { FeedbackSummaryResponseDto } from './dtos/feedback-summary-response.dto';
import { GetFeedbackSummaryListDto } from './dtos/get-feedback-summary-list.dto';
import { FeedbackSummaryService } from './feedback-summary.service';

@ApiTags('Feedback Summary')
@Controller('feedback-summary')
export class FeedbackSummaryController {
  constructor(
    private readonly feedbackSummaryService: FeedbackSummaryService,
  ) {}

  @ApiOkEnvelope(FeedbackSummaryResponseDto, {
    description: 'List feedback summary paginated',
    isArray: true,
  })
  @Get()
  public async list(
    @Query() request: GetFeedbackSummaryListDto,
  ): Promise<ApiResponse<FeedbackSummaryResponseDto[]>> {
    const { data, totalData } =
      await this.feedbackSummaryService.getPaginatedList(request);
    const meta = new PaginationMeta(totalData, request.page, request.size);

    return ApiResponse.successWithPagination(
      'Successfully get feedback summary list',
      data,
      meta,
    );
  }
}
