import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { AuthPayloadDto } from '../../dto/index';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const { body } = http.getRequest<Request>();

    const object = plainToInstance(AuthPayloadDto, body);
    const errors = validateSync(object);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token);

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: errors.reduce((storage: string[], current) => {
          if (current.constraints) {
            storage.push(...Object.values(current.constraints));
          }
          return storage;
        }, []),
      });
    }

    return super.canActivate(context);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('extract', token, type);
    return type === 'Bearer' ? token : undefined;
  }
}
