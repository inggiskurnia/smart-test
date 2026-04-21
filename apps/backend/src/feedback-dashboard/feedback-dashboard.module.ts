import { Module } from '@nestjs/common';

import { FeedbackDashboardController } from './feedback-dashboard.controller';
import { FeedbackDashboardService } from './feedback-dashboard.service';

@Module({
  controllers: [FeedbackDashboardController],
  providers: [FeedbackDashboardService],
})
export class FeedbackDashboardModule {}
