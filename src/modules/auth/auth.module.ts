import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenUserStrategy } from './passport-strategies/access-token-user/access-token-user.strategy';
import { LocalStrategy } from './passport-strategies/local/local.strategy';
import { RefreshTokenUserStrategy } from './passport-strategies/refresh-token-user/refresh-token-user.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenUserGuard } from './passport-strategies/access-token-user/access-token-user.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'process';
import { GoogleStrategy } from './passport-strategies/google-strategy/google-strategy';
import { SessionSerializer } from './passport-strategies/google-strategy/google-serializer';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.getOrThrow('jwt');
        return {
          secret: jwtConfig.accessTokenSecret,
          signOptions: { expiresIn: jwtConfig.accessTokenExpiration },
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 465,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_MAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenUserStrategy,
    LocalStrategy,
    RefreshTokenUserStrategy,
    GoogleStrategy,
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: AccessTokenUserGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {
}
