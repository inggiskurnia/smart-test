import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigEnvironment {
  constructor(private readonly configService: ConfigService) {}

  /**
   * application config
   */
  get appEnv(): string {
    return this.configService.get<string>('APP_ENV', 'development');
  }

  get port(): number {
    return Number(this.configService.get<string>('PORT') || 8080);
  }

  /**
   * neo4j config
   */
  get neo4jHost(): string {
    return this.configService.get<string>('NEO4J_HOST');
  }

  get neo4jUser(): string {
    return this.configService.get<string>('NEO4J_USER');
  }

  get neo4jPassword(): string {
    return this.configService.get<string>('NEO4J_PASSWORD');
  }

  get neo4jDatabase(): string {
    return this.configService.get<string>('NEO4J_DATABASE', 'neo4j');
  }

  get neo4jLossInteger(): boolean {
    return (
      this.configService.get<string>('NEO4J_DISABLE_LOSSLESS_INTEGERS') ===
      'true'
    );
  }

  get neo4jUseBigInt(): boolean {
    return this.configService.get<string>('NEO4J_USEBIGINT') === 'true';
  }

  /**
   * redis config
   */
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get redisPort(): number {
    return Number(this.configService.get<string>('REDIS_PORT') || 6379);
  }

  /**
   * minio config
   */
  get minioHost(): string {
    return this.configService.get<string>('MINIO_HOST');
  }

  get minioPort(): number {
    return Number(this.configService.get<string>('MINIO_PORT') || 9000);
  }

  get minioAccessKey(): string {
    return this.configService.get<string>('MINIO_ACCESS_KEY');
  }

  get minioSecretKey(): string {
    return this.configService.get<string>('MINIO_SECRET_KEY');
  }

  get minioBucket(): string {
    return this.configService.get<string>('MINIO_BUCKET');
  }

  get minioUseSSL(): boolean {
    const useSSL = this.configService.get('MINIO_USE_SSL');
    return useSSL === undefined ? false : useSSL === 'true';
  }
}
