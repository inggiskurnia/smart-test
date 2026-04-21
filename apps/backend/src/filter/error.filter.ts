import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigEnvironment } from '../config/config.environment';
import { ValidationException } from './validation.exception';
import { ApiResponse } from '../shared/api-response';
@Injectable()
@Catch(HttpException, Neo4jError, ValidationException)
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly config: ConfigEnvironment,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    let statusCode = 500;
    let message: string | string[] = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (Array.isArray(errorResponse['message'])) {
        const e = errorResponse['message'];
        if (e.length == 1) {
          message = e[0];
        } else {
          message = e.map((e) => e);
        }
      } else if (errorResponse['message']) {
        message = errorResponse['message'];
      } else {
        message = 'Bad Request';
      }
    } else if (exception instanceof Neo4jError) {
      statusCode = 400;
      message = exception.message;
    } else if (exception instanceof ValidationException) {
      statusCode = 400;
      message =
        this.config.appEnv === 'production'
          ? 'Invalid Request'
          : exception.getErrorMessage();
    }

    this.logger.error(
      `Error ${statusCode} - ${request.method} ${request.url} - ${JSON.stringify(
        message,
      )}`,
    );

    response.status(statusCode).json(ApiResponse.error(message, statusCode));
  }
}
