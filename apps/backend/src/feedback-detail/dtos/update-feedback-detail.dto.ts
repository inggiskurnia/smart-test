import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FeedbackStatus } from '../enum/feedback-status.enum';

export class UpdateFeedbackDetailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  id: string;

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
