import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Model, createConnection } from 'mongoose';
import { request, spec } from 'pactum';
import { AppModule } from '../src/app.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { AdminSchema } from '../src/admin/schema';
import { CreateAdminDto } from 'src/admin/dto';

let app: INestApplication;

beforeAll(async () => {
  await createConnection(process.env.MONGO_URI, {});

  const moduleRef = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(process.env.MONGO_URI), AppModule],
  }).compile();

  const adminModel: Model<AdminSchema> = moduleRef.get<Model<AdminSchema>>(
    getModelToken(AdminSchema.name),
  );

  await adminModel.deleteMany({});

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.init();
  app.listen(3001);

  request.setBaseUrl('http://localhost:3001');
});

afterAll(() => {
  app.close();
});

describe('ADMIN /admin', () => {
  describe('POST /create', () => {
    it('should throw an error if no body is provided', () => {
      return spec().post('/admin/create').expectStatus(400);
    });

    it('should throw an error if username is empty', () => {
      const dto: Omit<CreateAdminDto, 'username'> = {
        name: 'John Doe',
        password: '#JohnDoe@123',
      };

      return spec().post('/admin/create').withBody(dto).expectStatus(400);
    });

    it('should throw an error if name is empty', () => {
      const dto: Omit<CreateAdminDto, 'name'> = {
        username: 'johndoe',
        password: 'JohnDoe@123',
      };

      return spec().post('/admin/create').withBody(dto).expectStatus(400);
    });

    it('should thro an error if password is empty', () => {
      const dto: Omit<CreateAdminDto, 'password'> = {
        name: 'John Doe',
        username: 'johndoe',
      };

      return spec().post('/admin/create').withBody(dto).expectStatus(400);
    });

    it('should throw an error if password is not strong enough', () => {
      const dto: CreateAdminDto = {
        username: 'johndoe',
        name: 'John Doe',
        password: '1234',
      };

      return spec().post('/admin/create').withBody(dto).expectStatus(400);
    });

    it('should create new admin', () => {
      const dto: CreateAdminDto = {
        username: 'johndoe',
        name: 'John Doe',
        password: '#JohnDoe@123',
      };

      return spec()
        .post('/admin/create')
        .withBody(dto)
        .expectStatus(201)
        .expectBodyContains(dto.username)
        .expectBodyContains(dto.name);
    });
  });
});
