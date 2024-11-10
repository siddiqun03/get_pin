import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../../auth.service';
import { User } from '../../../user/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: User, done: Function): any {
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function): Promise<any> {
    const user = await this.authService.findUser(payload.id);
    console.log('deserializeUser\n', user);
    return user ? done(null, user) : done(null, null);
  }
}