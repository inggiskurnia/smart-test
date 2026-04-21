import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { getCtx } from './request-context';
import { redactDeep } from './redact';
import { HttpLoggingInterceptor } from './http-logging.interceptor';
import { format, transports } from 'winston';

const addContext = format((info) => {
  const ctx = getCtx();
  if (ctx?.requestId) info.requestId = ctx.requestId;
  if (ctx?.actor) info.actor = ctx.actor;
  return info;
});

const redactFormat = format((info) => {
  for (const [key, value] of Object.entries(info)) {
    if (key === 'level' || key === 'message' || key === 'timestamp') continue;
    info[key] = redactDeep(value);
  }
  return info;
});

const consoleFormat = format.combine(
  addContext(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  redactFormat(),
  format.colorize({
    level: true,
    colors: { error: 'red', warn: 'yellow', info: 'blue', debug: 'magenta' },
  }),
  format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }),
);

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL ?? 'info',
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
      ],
    }),
  ],
  providers: [HttpLoggingInterceptor],
  exports: [WinstonModule, HttpLoggingInterceptor],
})
export class LoggingModule {}
