import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './infra/validators';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AccessTokenUserGuard } from './modules/auth/passport-strategies/access-token-user/access-token-user.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import * as process from 'process';
import * as session from 'express-session';
import * as passport from 'passport';

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

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalFilters(new ErrorFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AccessTokenUserGuard(reflector), new RolesGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('GET-PIN 📌')
    .setDescription('GET-PIN API description')
    .setVersion('0.2')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      authAction: {
        bearerAuth: {
          name: 'bearerAuth',
          schema: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    },
  });

  await app.listen(process.env?.['PORT'] || 4001);
}

bootstrap().then(() => {
  logging.warn(`Server Is Running on ${process.env?.['PORT'] || 4001}`);
});
