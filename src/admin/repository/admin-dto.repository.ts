import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminSchema } from '../schema';
import { FilterQuery, Model } from 'mongoose';
import { AdminDto } from '../dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminDtoRepository {
  constructor(
    @InjectModel(AdminSchema.name)
    private readonly adminModel: Model<AdminSchema>,
  ) {}

  async findById(id: string): Promise<AdminDto> {
    return await this.adminModel.findById(new ObjectId(id), {}, { lean: true });
  }

  async findByUsername(username: string): Promise<AdminDto> {
    const admin = await this.adminModel.findOne(
      { username } as FilterQuery<AdminSchema>,
      {},
      { lean: true },
    );

    if (!admin) {
      throw new UnauthorizedException('There is no admin with this username');
    }

    return admin;
  }
}
