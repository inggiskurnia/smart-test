import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiOkEnvelope } from '../decorators/api-envelope.decorator';
import { ApiResponse } from '../shared/api-response';
import { PaginationMeta } from '../shared/pagination-meta';

import { FeedbackDetailService } from './feedback-detail.service';
import { FeedbackDetailEntity } from './entities/feedback-detail.entity';
import { CreateFeedbackDetailDto } from './dtos/create-feedback-detail.dto';
import { UpdateFeedbackDetailDto } from './dtos/update-feedback-detail.dto';
import { GetFeedbackDetailListDto } from './dtos/get-feedback-detail-list.dto';

@ApiTags('Feedback Detail')
@Controller('feedback-detail')
export class FeedbackDetailController {
  constructor(private readonly feedbackDetailService: FeedbackDetailService) {}

  @ApiOkEnvelope(FeedbackDetailEntity, {
    description: 'Create feedback detail',
  })
  @Post()
  public async create(
    @Body() requestBody: CreateFeedbackDetailDto,
  ): Promise<ApiResponse<FeedbackDetailEntity>> {
    const data = await this.feedbackDetailService.create(requestBody);

    return ApiResponse.success('Create feedback detail success', data);
  }

  @ApiOkEnvelope(FeedbackDetailEntity, {
    description: 'List feedback detail paginated',
    isArray: true,
  })
  @Get()
  public async list(
    @Query() request: GetFeedbackDetailListDto,
  ): Promise<ApiResponse<FeedbackDetailEntity[]>> {
    const { data, totalData } =
      await this.feedbackDetailService.getPaginatedList(request);
    const meta = new PaginationMeta(totalData, request.page, request.size);

    return ApiResponse.successWithPagination(
      'Successfully get paginated list',
      data,
      meta,
    );
  }

  @ApiOkEnvelope(FeedbackDetailEntity, {
    description: 'Feedback detail by id',
  })
  @Get(':id')
  public async getById(
    @Param('id') id: string,
  ): Promise<ApiResponse<FeedbackDetailEntity>> {
    const data = await this.feedbackDetailService.getById(id);

    return ApiResponse.success('Successfully get by id', data);
  }

  @ApiOkEnvelope(FeedbackDetailEntity, {
    description: 'Update feedback detail by id',
  })
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() requestBody: UpdateFeedbackDetailDto,
  ): Promise<ApiResponse<FeedbackDetailEntity>> {
    const data = await this.feedbackDetailService.update(id, requestBody);

    return ApiResponse.success('Successfully update feedback detail', data);
  }

  @ApiOkEnvelope('boolean', {
    description: 'Delete feedback detail by id',
  })
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    const result = await this.feedbackDetailService.deleteById(id);

    return ApiResponse.success('success delete feedback detail', result);
  }
}
