import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigEnvironment } from '../config/config.environment';
import { Client } from 'minio';
import { MINIO_CLIENT } from './minio';

@Module({
  providers: [
    MinioService,
    {
      provide: MINIO_CLIENT,
      useFactory: (config: ConfigEnvironment) =>
        new Client({
          endPoint: config.minioHost,
          port: config.minioPort,
          useSSL: config.minioUseSSL,
          accessKey: config.minioAccessKey,
          secretKey: config.minioSecretKey,
        }),
      inject: [ConfigEnvironment],
    },
  ],
  exports: [MinioService],
})
export class MinioModule {}
