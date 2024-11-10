import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthWithEmailDto, ConfirmOtpDto } from './dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import AuthWithNumberDto from './dto/auth-with-number.dto';
import { GenerateLogin, GenerateRandomNumber, MailOptions, SuccessResponse } from '../../infra/utils';
import { MailerService } from '@nestjs-modules/mailer';
import generateCharacters from '../../infra/utils/generate-charackters.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly mailService: MailerService,
  ) {
  }

  async validateUserByEmailPassword(login: string, password: string) {
    const user = await this.userService.getByLogin(login);
    if (!user) {
      throw new BadRequestException('Invalid login.');
    }

    const isPasswordSame = await this.comparePasswordWithHash(
      password,
      user.password,
    );
    if (!isPasswordSame) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }

  async validateByEmail({ email, firstName, lastName }: { email: string, firstName: string, lastName: string }) {
    const user = await this.userService.findUserBy({ email });
    if (!user?.email) {
      return await this.userService.create({
        email,
        login: GenerateLogin(),
        password: generateCharacters(8),
        firstName,
        lastName,
        role: 1,
      });
    }
    return user;
  }

  async findUser(id: string) {
    return await this.userService.findUserBy({ id });
  }

  async validateUserById(userId: string) {
    return await this.userService.getOne(userId).catch(() => {
      throw new BadRequestException('Valid token with non-existent user.');
    });
  }

  async authWithEmail(data: AuthWithEmailDto) {
    const ttl = await this.getCacheTTL(data.email);

    if (ttl) {
      throw new BadRequestException({
        message: `Have: ${Math.round(ttl / 1000)}`,
        ttl: Math.round(ttl / 1000),
      });
    }
    const code = GenerateRandomNumber(4);

    await this.cacheManager.set(data.email, JSON.stringify({ code, data: data }), 60000);
    await this.mailService.sendMail(MailOptions(data.email, code, data.login, data.password));

    return SuccessResponse({ message: 'Code sent.' }, {});
  }

  async authWithNumber(data: AuthWithNumberDto) {
    const ttl = await this.getCacheTTL(data.phone);

    if (ttl) {
      throw new BadRequestException({
        message: `Have: ${Math.round(ttl / 1000)}`,
        ttl: Math.round(ttl / 1000),
      });
    }
    const code = 1234; // GenerateRandomNumber(4)
    await this.cacheManager.set(data.phone, JSON.stringify({ code, data: data }), 60000);

    return SuccessResponse({ otp: code, ttl: 60 }, {});
  }

  async confirmOtp(data: ConfirmOtpDto) {
    const cache: string = await this.cacheManager.get(data.login);
    if (!cache) throw new BadRequestException({ message: 'OTP Expired!' });
    const dataCache: { code: number, data: AuthWithNumberDto } = JSON.parse(cache);
    if (dataCache.code != data.otp) {
      throw new BadRequestException({ message: 'OTP not equal!' });
    }
    const response = await this.userService.findOrCreate(dataCache.data);
    const accessToken = this.getJwt('access', response);
    const refreshToken = this.getJwt('refresh', response);

    return SuccessResponse({ accessToken, refreshToken }, {});
  }

  // utils:
  getJwt(type: 'access' | 'refresh', sub: string) {
    const payload = { sub };

    if (type === 'access') {
      return this.jwtService.sign(payload);
    }

    const jwtConfig = this.configService.getOrThrow('jwt');
    return this.jwtService.sign(payload, {
      secret: jwtConfig.refreshTokenSecret,
      expiresIn: jwtConfig.refreshTokenExpiration,
    });
  }

  async getCacheTTL(key: string): Promise<number | undefined> {
    const cacheStore = this.cacheManager.store;
    return await cacheStore.ttl(key);
  }

  async comparePasswordWithHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
