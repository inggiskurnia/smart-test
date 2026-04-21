import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiOkEnvelope } from '../decorators/api-envelope.decorator';
import { ApiResponse } from '../shared/api-response';
import { FeedbackDashboardResponseDto } from './dtos/feedback-dashboard-response.dto';
import { FeedbackDashboardService } from './feedback-dashboard.service';

@ApiTags('Feedback Dashboard')
@Controller('feedback-dashboard')
export class FeedbackDashboardController {
  constructor(
    private readonly feedbackDashboardService: FeedbackDashboardService,
  ) {}

  @ApiOkEnvelope(FeedbackDashboardResponseDto, {
    description: 'Feedback dashboard',
  })
  @Get()
  public async getDashboard(): Promise<
    ApiResponse<FeedbackDashboardResponseDto>
  > {
    const data = await this.feedbackDashboardService.getDashboard();

    return ApiResponse.success('Successfully get feedback dashboard', data);
  }
}
