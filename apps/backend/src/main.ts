import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as http from 'http';
import * as https from 'https';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigEnvironment } from './config/config.environment';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './app.doc';
import { ValidationPipe } from '@nestjs/common';
import { AuthContextInterceptor } from './logging/auth-context.interceptor';
import { HttpLoggingInterceptor } from './logging/http-logging.interceptor';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(compression());

  const corsOption: CorsOptions = {
    origin: false,
    methods: 'GET,HEAD,PUT,POST,DELETE',
  };

  app.enableCors(corsOption);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://trusted-scripts.com'],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'"],
          objectSrc: ["'none'"],
          connectSrc: ["'self'", 'wss:'],
          upgradeInsecureRequests: [],
        },
      },
      frameguard: { action: 'deny' },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
      noSniff: true,
      dnsPrefetchControl: { allow: false },
      referrerPolicy: { policy: 'no-referrer' },
      xssFilter: false,
      hidePoweredBy: true,
    }),
  );

  app.useGlobalInterceptors(
    new AuthContextInterceptor(),
    app.get(HttpLoggingInterceptor),
  );

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('doc', app, document);
  await app.init();

  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  app.useLogger(logger);

  const config = app.get(ConfigEnvironment);
  const modeApplication = config.appEnv;
  const port = config.port;

  if (modeApplication === 'production') {
    const httpsOption = {};
    https.createServer(httpsOption, server).listen(port, () => {
      logger.info(`Application running on ${modeApplication} mode ${port}`);
    });
    http.createServer(server).listen(port, () => {
      logger.info(`Application running on ${modeApplication} mode ${port}`);
    });
  } else {
    http.createServer(server).listen(port, () => {
      logger.info(
        `Application running on ${modeApplication} mode on port ${port}`,
      );
    });
  }
}
bootstrap();
