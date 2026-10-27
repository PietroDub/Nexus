import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { User } from '../models/user.model.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  create(dto: CreateUserDto): User {
    if (this.users.find((user) => user.email === dto.email)) {
      throw new BadRequestException('Email already exists');
    }
    
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      email: dto.email,
      displayName: dto.displayName,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, dto: UpdateUserDto): User | undefined {
    const user = this.findOne(id);
    if (!user) {
      return undefined;
    }
    user.email = dto.email ?? user.email;
    user.displayName = dto.displayName ?? user.displayName;
    user.updatedAt = new Date();
    return user;
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
