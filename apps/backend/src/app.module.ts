import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { AppFilter, AppGuard } from './app.provider';
import { MinioModule } from './minio/minio.module';
import { LoggingModule } from './logging/logging.module';
import { RequestContextMiddleware } from './logging/request-context.middleware';
import { HttpLoggingInterceptor } from './logging/http-logging.interceptor';
import { FeedbackDetailModule } from './feedback-detail/feedback-detail.module';
import { FeedbackSummaryModule } from './feedback-summary/feedback-summary.module';
import { FeedbackDashboardModule } from './feedback-dashboard/feedback-dashboard.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'dist'),
    }),
    LoggingModule,
    ConfigModule,
    Neo4jModule.fromEnv(),
    MinioModule,
    FeedbackDetailModule,
    FeedbackSummaryModule,
    FeedbackDashboardModule,
  ],
  providers: [AppFilter, AppGuard, HttpLoggingInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
