import { HttpStatus } from '@nestjs/common';
import { PaginationMeta } from './pagination-meta';

export class ApiResponse<T, M = any> {
  success: boolean;
  statusCode: number;
  message: string | string[];
  data?: T;
  meta?: M;

  constructor(
    success: boolean,
    statusCode: number,
    message: string | string[],
    data?: T,
    meta?: M,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
    if (meta) this.meta = meta;
  }

  static success<T, M = any>(
    message = 'Request successful',
    data: T,
    meta?: M,
  ): ApiResponse<T, M> {
    return new ApiResponse<T, M>(true, HttpStatus.OK, message, data, meta);
  }

  static successWithPagination<T>(
    message: string,
    data: T,
    meta: PaginationMeta,
  ): ApiResponse<T, PaginationMeta> {
    return new ApiResponse<T, PaginationMeta>(
      true,
      HttpStatus.OK,
      message,
      data,
      meta,
    );
  }

  static error<T>(
    message: string | string[] = 'An error occurred',
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ApiResponse<T> {
    return new ApiResponse<T>(false, statusCode, message);
  }
}
