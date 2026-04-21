import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetFeedbackDetailListDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination (starts from 1)',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  size?: number = 10;
}
