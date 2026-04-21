import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FeedbackSummaryResponseDto {
  @Expose()
  periode: string;

  @Expose()
  controlSystem: string;

  @Expose()
  totalFeedback: number;

  @Expose()
  issueOpen: number;

  @Expose()
  issueClosed: number;

  @Expose()
  progress: number;
}
