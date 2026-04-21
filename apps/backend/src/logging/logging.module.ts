import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { getCtx } from './request-context';
import { redactDeep } from './redact';
import { HttpLoggingInterceptor } from './http-logging.interceptor';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'node:path';

const LOG_DIR = path.resolve(process.cwd(), 'storage', 'logs');

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

const fileTransport = new transports.DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
  zippedArchive: true,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    addContext(),
    redactFormat(),
    format.json(),
  ),
});

fileTransport.on('error', (e) => console.error('DailyRotateFile error:', e));
fileTransport.on('warning', (w) => console.warn('DailyRotateFile warning:', w));

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
        fileTransport,
      ],
    }),
  ],
  providers: [HttpLoggingInterceptor],
  exports: [WinstonModule, HttpLoggingInterceptor],
})
export class LoggingModule {}
