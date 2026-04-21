import { Module } from '@nestjs/common';

import { FeedbackSummaryController } from './feedback-summary.controller';
import { FeedbackSummaryService } from './feedback-summary.service';

@Module({
  controllers: [FeedbackSummaryController],
  providers: [FeedbackSummaryService],
})
export class FeedbackSummaryModule {}
