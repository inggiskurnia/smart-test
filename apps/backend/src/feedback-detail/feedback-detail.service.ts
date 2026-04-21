import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v7 as uuid } from 'uuid';
import { Logger } from 'winston';

import { PageRequest } from '../helper/helper.api';
import { FeedbackDetailRepository } from './repository/feedback-detail.repository';
import { CreateFeedbackDetailDto } from './dtos/create-feedback-detail.dto';
import { FeedbackDetailEntity } from './entities/feedback-detail.entity';
import { GetFeedbackDetailListDto } from './dtos/get-feedback-detail-list.dto';
import { UpdateFeedbackDetailDto } from './dtos/update-feedback-detail.dto';

@Injectable()
export class FeedbackDetailService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly feedbackDetailRepository: FeedbackDetailRepository,
  ) {}

  public async create(
    request: CreateFeedbackDetailDto,
  ): Promise<FeedbackDetailEntity> {
    this.logger.warn('create feedback detail', {
      context: FeedbackDetailService.name,
      request,
    });

    const now = Date.now() / 1000;
    const entity = plainToInstance(FeedbackDetailEntity, {
      id: uuid(),
      ...request,
      createdAt: now,
      updatedAt: now,
      deletedAt: 0,
    });

    return this.feedbackDetailRepository.save(entity);
  }

  public async getPaginatedList(request: GetFeedbackDetailListDto) {
    this.logger.warn('get paginated list feedback detail', {
      context: FeedbackDetailService.name,
      request,
    });

    const pageRequest: PageRequest = {
      skip: (request.page - 1) * request.size,
      limit: request.size,
    };

    const { results, totalData } =
      await this.feedbackDetailRepository.findAllWithPagination(
        pageRequest,
        false,
      );

    return { data: results, totalData };
  }

  public async getById(id: string): Promise<FeedbackDetailEntity> {
    this.logger.warn('get feedback detail by id', {
      context: FeedbackDetailService.name,
      id,
    });

    const entity = await this.feedbackDetailRepository.findById(id);
    this.ensureExists(entity);

    return entity;
  }

  public async update(
    id: string,
    request: UpdateFeedbackDetailDto,
  ): Promise<FeedbackDetailEntity> {
    this.logger.warn('update feedback detail', {
      context: FeedbackDetailService.name,
      id,
      request,
    });

    const existing = await this.feedbackDetailRepository.findById(id);
    this.ensureExists(existing);

    const entity = plainToInstance(FeedbackDetailEntity, {
      ...existing,
      ...request,
      id,
      createdAt: existing.createdAt,
      updatedAt: Date.now() / 1000,
      deletedAt: existing.deletedAt ?? 0,
    });

    return this.feedbackDetailRepository.update(id, entity);
  }

  public async deleteById(id: string): Promise<boolean> {
    this.logger.warn('delete feedback detail by id', {
      context: FeedbackDetailService.name,
      id,
    });

    const entity = await this.feedbackDetailRepository.findById(id);
    this.ensureExists(entity);

    await this.feedbackDetailRepository.delete(id);
    return true;
  }

  private ensureExists(entity: FeedbackDetailEntity | null): void {
    if (!entity || Number(entity.deletedAt ?? 0) > 0) {
      throw new HttpException(
        'Feedback detail not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
