import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Model, createConnection } from 'mongoose';
import { request, spec } from 'pactum';
import { AppModule } from '../src/app.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { AdminSchema } from '../src/admin/schema';
import { CreateAdminDto } from '../src/admin/dto';
import { RefreshTokenSchema } from '../src/auth/schema';
import { AdminSigninDto } from '../src/auth/dto';

let app: INestApplication;

beforeAll(async () => {
  await createConnection(process.env.MONGO_URI, {});

  const moduleRef = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(process.env.MONGO_URI), AppModule],
  }).compile();

  const adminModel: Model<AdminSchema> = moduleRef.get<Model<AdminSchema>>(
    getModelToken(AdminSchema.name),
  );
  const refreshTokenModel: Model<RefreshTokenSchema> = moduleRef.get<
    Model<RefreshTokenSchema>
  >(getModelToken(RefreshTokenSchema.name));

  await adminModel.deleteMany({});
  await refreshTokenModel.deleteMany({});

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

describe('ADMIN', () => {
  describe('POST /admin/create', () => {
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

  describe('POST /auth/admin', () => {
    it('should throw an error if body not provided', () => {
      return spec().post('/auth/admin').expectStatus(400);
    });

    it('should throw an error if username is empty', () => {
      const dto: Omit<AdminSigninDto, 'username'> = {
        password: '#JohnDoe@123',
      };

      return spec().post('/auth/admin').withBody(dto).expectStatus(400);
    });

    it('should throw an error if password is empty', () => {
      const dto: Omit<AdminSigninDto, 'password'> = {
        username: 'johndoe',
      };

      return spec().post('/auth/admin').withBody(dto).expectStatus(400);
    });

    it('should throw an error if username is incorrect', () => {
      const dto: AdminSigninDto = {
        username: 'john',
        password: '#JohnDoe@123',
      };

      return spec().post('/auth/admin').withBody(dto).expectStatus(404);
    });

    it('should throw an error if password is incorrect', () => {
      const dto: AdminSigninDto = {
        username: 'johndoe',
        password: '1234',
      };

      return spec().post('/auth/admin').withBody(dto).expectStatus(401);
    });

    it('should signin admin', () => {
      const dto: AdminSigninDto = {
        username: 'johndoe',
        password: '#JohnDoe@123',
      };

      return spec()
        .post('/auth/admin')
        .withBody(dto)
        .expectStatus(200)
        .stores('accessToken', 'access_token')
        .stores('refreshToken', 'refresh_token');
    });
  });
});
