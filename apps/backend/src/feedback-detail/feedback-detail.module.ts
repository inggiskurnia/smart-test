import { Module } from '@nestjs/common';

import { FeedbackDetailController } from './feedback-detail.controller';
import { FeedbackDetailService } from './feedback-detail.service';
import { FeedbackDetailRepository } from './repository/feedback-detail.repository';

@Module({
  controllers: [FeedbackDetailController],
  providers: [FeedbackDetailService, FeedbackDetailRepository],
  exports: [FeedbackDetailRepository],
})
export class FeedbackDetailModule {}
