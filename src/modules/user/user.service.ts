import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

Injectable();

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async getAll(options: IPaginationOptions, where): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }
}
