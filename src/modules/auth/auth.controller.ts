import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { AuthPayloadDto, AuthWithEmailDto, AuthWithNumberDto, ConfirmOtpDto } from './dto';
import { User } from '../user/user.entity';
import { LocalAuthGuard } from './passport-strategies/local/local-auth.guard';
import { GoogleAuthGuard } from './passport-strategies/google-strategy/google-guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Unauthorized!' };
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'ok' };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been returned.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  login(
    @Body() authPayload: AuthPayloadDto,
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = this.authService.getJwt('access', user.id);
    const refreshToken = this.authService.getJwt('refresh', user.id);

    return { accessToken, refreshToken };
  }

  @Public()
  @Post('/auth/email')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been returned.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async authEmail(
    @Body() authWithEmail: AuthWithEmailDto,
  ) {
    return await this.authService.authWithEmail(authWithEmail);
  }

  @Public()
  @Post('/auth/phone')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been returned.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async authNumber(
    @Body() authWithEmail: AuthWithNumberDto,
  ) {
    return await this.authService.authWithNumber(authWithEmail);
  }

  @Public()
  @Post('/auth/confirm-otp')
  @HttpCode(200)
  @ApiNoContentResponse({
    description: 'New access, refresh tokens have been returned.',
  })
  @ApiBadRequestResponse({ description: 'Something went wrong from FE' })
  async confirmOtp(
    @Body() confirmOtp: ConfirmOtpDto,
  ) {
    return await this.authService.confirmOtp(confirmOtp);
  }
}
