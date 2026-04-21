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

  get appCompany(): string {
    return this.configService.get<string>('APP_COMPANY');
  }

  get appCode(): string {
    return this.configService.get<string>('APP_CODE', 'KITB');
  }

  get port(): number {
    return Number(this.configService.get<string>('PORT') || 8080);
  }

  get license(): number {
    return Number(this.configService.get<string>('LICENSE') || 0);
  }

  set license(value: string) {
    this.configService.set('LICENSE', value);
  }

  get concurrent(): number {
    return Number(this.configService.get<string>('CONCURRENT') || 10);
  }

  set concurrent(value: string) {
    this.configService.set('CONCURRENT', value);
  }

  /**
   * Azure SSO config
   */
  get azureTenantId(): string {
    return this.configService.get<string>('TENANT_ID');
  }

  get azureClientId(): string {
    return this.configService.get<string>('CLIENT_ID');
  }

  get azureClientSecret(): string {
    return this.configService.get<string>('CLIENT_SECRET');
  }

  get azureRedirectUri(): string {
    return this.configService.get<string>('REDIRECT_URI');
  }

  get azureScopes(): string {
    return this.configService.get<string>('SCOPES', 'openid profile email');
  }

  get azureIssuer(): string {
    return this.configService.get<string>('AZURE_ISSUER');
  }

  get azureJwksUri(): string {
    return this.configService.get<string>('AZURE_JWKS_URI');
  }

  get azureApiAudience(): string {
    return this.configService.get<string>('AZURE_API_AUDIENCE');
  }

  get baseUrlFrontend(): string {
    return this.configService.get<string>(
      'BASE_URL_FRONTEND',
      'http://localhost:3000',
    );
  }

  get refreshCookieName(): string {
    const normalized = (this.appCode ?? '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_');
    return `_SECURE_RT${normalized ? `_${normalized}` : ''}`;
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
   * jwt config
   */
  get tokenKey(): string {
    return this.configService.get<string>('ACCESS_KEY');
  }

  get refereshKey(): string {
    return this.configService.get<string>('REFRESH_KEY');
  }

  /**
   * redis config
   */
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get useAzure(): boolean {
    return this.configService.get<string>('USE_AZURE') === 'true';
  }

  get redisPort(): number {
    return Number(this.configService.get<string>('REDIS_PORT') || 6379);
  }

  /**
   * smtp config
   */
  get smtpHost(): string {
    return this.configService.get<string>('SMTP_HOST');
  }

  get smtpPort(): number {
    return Number(this.configService.get<string>('SMTP_PORT') || 587);
  }

  get smtpUser(): string {
    return this.configService.get<string>('SMTP_USER');
  }

  get smtpPassword(): string {
    return this.configService.get<string>('SMTP_PASSWORD');
  }

  get smtpSecure(): boolean {
    return this.configService.get<string>('SMTP_SECURE') === 'true';
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
