import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FeedbackDashboardResponseDto {
  @Expose()
  totalFeedback: number;

  @Expose()
  issueOpen: number;

  @Expose()
  issueClose: number;

  @Expose()
  averageProgress: number;
}
