import { FeedbackStatus } from '../enum/feedback-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  periode: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  controlSystem: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  equipment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  problem: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  solusi: string;

  @ApiProperty()
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus.OPEN;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  progress: number;
}
