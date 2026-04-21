import { Global, Module } from '@nestjs/common';
import { ConfigModule as GlobalConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigEnvironment } from './config.environment';
import { CacheModule } from '@nestjs/cache-manager';
import { createCacheConfig } from './config.cache';
import { seconds, ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    GlobalConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigEnvironment],
      useFactory: async (config: ConfigEnvironment) => {
        const store = await createCacheConfig(config);
        return { stores: store };
      },
    }),
    ScheduleModule.forRoot({}),
    ThrottlerModule.forRoot([
      {
        ttl: seconds(60),
        limit: 100,
      },
    ]),
  ],
  providers: [ConfigEnvironment],
  exports: [ConfigEnvironment],
})
export class ConfigModule {}
