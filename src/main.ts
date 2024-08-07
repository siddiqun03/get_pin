import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './infra/validators';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logging = new Logger('Request Middleware', { timestamp: true });

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function() {
      logging.warn(`Response for ${req.method} ${req.url}`);
      // eslint-disable-next-line prefer-rest-params
      originalSend.apply(res, arguments);
    };
    next();
  });

  app.useGlobalFilters(new ErrorFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('GRM uz')
    .setDescription('GET-PIN API description')
    .setVersion('0.2')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env?.['PORT'] || 4001);
}

bootstrap().then(() => {
  logging.warn(`Server Is Running on ${process.env?.['PORT'] || 4001}`);
});
