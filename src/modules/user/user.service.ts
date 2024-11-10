import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import AuthWithEmailPayloadDto from '../auth/dto/auth-with-email.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AuthWithNumberDto } from '../auth/dto';

Injectable();

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
  }

  async getAll(options: IPaginationOptions, where): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  async getByLogin(login) {
    return await this.userRepository.findOne({
      where: { login },
    });
  }

  async getOne(id: string) {
    return await this.userRepository
      .findOne({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new NotFoundException('User not found');
      });
  }

  async create(data: object): Promise<User> {
    const res = this.userRepository.create(data);
    return await this.userRepository.save(res);
  }

  async findOrCreate(data: AuthWithEmailPayloadDto | AuthWithNumberDto): Promise<string> {
    if (!(data instanceof AuthWithEmailPayloadDto)) {
      const res = await this.userRepository.findOne({
        where: {
          phone: data?.phone,
        },
      });
      return res.id;
    } else if (!(data instanceof AuthWithNumberDto)) {
      const res = await this.userRepository.findOne({
        where: {
          email: data.email,
        },
      });
      return res.id;
    }

    const res = this.userRepository.create(data);
    return (await this.userRepository.save(res)).id;
  }

  async findUserBy(data: object) {
    return await this.userRepository.findOneBy({ ...data });
  }
}
