import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ObjectId } from 'mongodb';
import { EntityFactory } from '@app/common';
import { Admin } from '.';
import { AdminEntityRepository } from '../repository';

@Injectable()
export class AdminFactory implements EntityFactory<Admin> {
  constructor(private readonly adminEntityRepository: AdminEntityRepository) {}

  async create(
    username: string,
    name: string,
    password: string,
  ): Promise<Admin> {
    try {
      const hash = await argon.hash(password);
      const admin = new Admin(
        new ObjectId().toHexString(),
        username,
        name,
        hash,
      );

      await this.adminEntityRepository.create(admin);
      return admin;
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('username already in use');
      }

      throw error;
    }
  }
}
