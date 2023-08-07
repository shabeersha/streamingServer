import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Model, createConnection } from 'mongoose';
import { request, spec } from 'pactum';
import { AppModule } from '../src/app.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { AdminSchema } from '../src/admin/schema';
import { CreateAdminDto } from '../src/admin/dto';
import { RefreshTokenSchema } from '../src/auth/schema';
import { AdminSigninDto, BatchSigninDto, TokenDto } from '../src/auth/dto';
import { CreateVideoDto, EditVideoDto, ManageVideoDto } from '../src/video/dto';
import { VideoSchema } from '../src/video/schema';
import { CreateBatchDto } from '../src/batch/dto';
import { BatchSchema } from '../src/batch/schema';
import { ObjectId } from 'mongodb';

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
  const videoModel: Model<VideoSchema> = moduleRef.get<Model<VideoSchema>>(
    getModelToken(VideoSchema.name),
  );
  const batchModel: Model<BatchSchema> = moduleRef.get<Model<BatchSchema>>(
    getModelToken(BatchSchema.name),
  );

  await adminModel.deleteMany({});
  await refreshTokenModel.deleteMany({});
  await videoModel.deleteMany({});
  await batchModel.deleteMany({});

  await adminModel.create({
    _id: new ObjectId(),
    username: 'johndoe',
    name: 'John Doe',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$AuuEOEGe+HGN5C2D5mv2KA$WXyWOPsG3IT/IA33dinKw7Yy/yD/x59Err5pY03xLYI',
  });

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
  describe('POST /auth/admin', () => {
    it('should throw an error if body not provided', () => {
      return spec().post('/auth/admin').expectStatus(400);
    });

    it('should throw an error if username is empty', () => {
      const dto: Omit<AdminSigninDto, 'username'> = {
        password: '#JohnDoe123',
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
        password: '#JohnDoe123',
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
        password: '#JohnDoe123',
      };

      return spec()
        .post('/auth/admin')
        .withBody(dto)
        .expectStatus(200)
        .stores('accessToken', 'access_token')
        .stores('refreshToken', 'refresh_token');
    });
  });

  describe('POST /admin/create', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec().post('/admin/create').expectStatus(401);
    });

    it('should throw an error if body not provided', () => {
      return spec()
        .post('/admin/create')
        .withBearerToken('$S{accessToken}')
        .expectStatus(400);
    });

    it('should throw an error if username is empty', () => {
      const dto: Omit<CreateAdminDto, 'username'> = {
        name: 'Test Admin',
        password: '#TestPassword123',
      };

      return spec()
        .post('/admin/create')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if name is empty', () => {
      const dto: Omit<CreateAdminDto, 'name'> = {
        username: 'testadmin',
        password: '#TestPassword123',
      };

      return spec()
        .post('/admin/create')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should thro an error if password is empty', () => {
      const dto: Omit<CreateAdminDto, 'password'> = {
        name: 'Test Admin',
        username: 'testadmin',
      };

      return spec()
        .post('/admin/create')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if password is not strong enough', () => {
      const dto: CreateAdminDto = {
        username: 'testadmin',
        name: 'Test Admin',
        password: '1234',
      };

      return spec()
        .post('/admin/create')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should create new admin', () => {
      const dto: CreateAdminDto = {
        username: 'testadmin',
        name: 'Test Admin',
        password: '#TestPassword123',
      };

      return spec()
        .post('/admin/create')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(201)
        .expectBodyContains(dto.username)
        .expectBodyContains(dto.name);
    });
  });

  describe('GET /admin', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec().get('/admin').expectStatus(401);
    });

    it('should get admin', () => {
      return spec()
        .get('/admin')
        .withBearerToken('$S{accessToken}')
        .expectStatus(200);
    });
  });

  describe('POST /auth/admin/refresh', () => {
    it('should throw an error if provided refreshtoken is invalid', () => {
      const dto: TokenDto = {
        token: 'invalid',
      };

      return spec().post('/auth/admin/refresh').withBody(dto).expectStatus(401);
    });

    it('should throw an error if no body is provided', () => {
      return spec().post('/auth/admin/refresh').expectStatus(401);
    });

    it('should refresh admin token', () => {
      const dto: TokenDto = {
        token: '$S{refreshToken}',
      };

      return spec()
        .post('/auth/admin/refresh')
        .withBody(dto)
        .expectStatus(200)
        .stores('accessToken', 'access_token');
    });
  });

  describe('DELETE /auth/admin', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec().delete('/auth/admin').expectStatus(401);
    });

    it('should signout admin', () => {
      return spec()
        .delete('/auth/admin')
        .withBearerToken('$S{accessToken}')
        .expectStatus(204)
        .expectBody('');
    });
  });
});

describe('VIDEO', () => {
  describe('POST /video', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec().post('/video').expectStatus(401);
    });

    it('should throw an error if body not provided', () => {
      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .expectStatus(400);
    });

    it('should throw an error if videoKey is empty', () => {
      const dto: Omit<CreateVideoDto, 'videoKey'> = {
        videoUrl: 'http://example.com/video.mp4',
        videoThumbnail: 'http://example.com/thumbnail.jpg',
        description: 'Example video description',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if videoUrl is empty', () => {
      const dto: Omit<CreateVideoDto, 'videoUrl'> = {
        videoKey: 1,
        videoThumbnail: 'http://example.com/thumbnail.jpg',
        description: 'Example video description',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if videoThumbnail is empty', () => {
      const dto: Omit<CreateVideoDto, 'videoThumbnail'> = {
        videoKey: 1,
        videoUrl: 'http://example.com/video.mp4',
        description: 'Example video description',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if description is empty', () => {
      const dto: Omit<CreateVideoDto, 'description'> = {
        videoKey: 1,
        videoUrl: 'http://example.com/video.mp4',
        videoThumbnail: 'http://example.com/thumbnail.jpg',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should create video', () => {
      const dto: CreateVideoDto = {
        videoKey: 1,
        videoUrl: 'http://example.com/video.mp4',
        videoThumbnail: 'http://example.com/thumbnail.jpg',
        description: 'Example video description',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(201)
        .expectBodyContains(dto.videoKey)
        .expectBodyContains(dto.videoUrl)
        .expectBodyContains(dto.videoThumbnail)
        .expectBodyContains(dto.description)
        .stores('videoId', '_id');
    });

    it('should create another video', () => {
      const dto: CreateVideoDto = {
        videoKey: 2,
        videoUrl: 'http://example.com/video.mp4',
        videoThumbnail: 'http://example.com/thumbnail.jpg',
        description: 'Example video description',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(201)
        .expectBodyContains(dto.videoKey)
        .expectBodyContains(dto.videoUrl)
        .expectBodyContains(dto.videoThumbnail)
        .expectBodyContains(dto.description)
        .stores('videoId2', '_id');
    });

    it('should throw an error if videokey already in use', () => {
      const dto: CreateVideoDto = {
        videoKey: 1,
        videoUrl: 'http://example.com/video.mp4',
        videoThumbnail: 'http://example.com/thumbnail.jpg',
        description: 'Example video description',
      };

      return spec()
        .post('/video')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(403);
    });
  });

  describe('PATCH /video/:id', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec()
        .patch('/video/{id}')
        .withPathParams({
          id: '$S{videoId}',
        })
        .expectStatus(401);
    });

    it('should throw an error if videoId is not provided', () => {
      return spec()
        .patch('/video')
        .withBearerToken('$S{accessToken}')
        .expectStatus(404);
    });

    it('should throw an error if videoId is invalid', () => {
      const dto: EditVideoDto = {
        description: 'This is an edited description',
      };

      return spec()
        .patch('/video/{id}')
        .withPathParams({
          id: '6a5a4a3a2a1a',
        })
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(404);
    });

    it('should edit video', () => {
      const dto: EditVideoDto = {
        description: 'This is an edited description',
      };

      return spec()
        .patch('/video/{id}')
        .withPathParams({ id: '$S{videoId}' })
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.description);
    });
  });

  describe('DELETE /video/:id', () => {
    it('should throw an error if the no authorization bearer is provided', () => {
      return spec()
        .delete('/video/{id}')
        .withPathParams({ id: '$S{videoId}' })
        .expectStatus(401);
    });

    it('should throw an error if videoId is not provided', () => {
      return spec()
        .delete('/video')
        .withBearerToken('$S{accessToken}')
        .expectStatus(404);
    });

    it('should throw an error if videoId is invalid', () => {
      return spec()
        .delete('/video/{id}')
        .withPathParams({
          id: '6a5a4a3a2a1a',
        })
        .withBearerToken('$S{accessToken}')
        .expectStatus(404);
    });

    it('should delete video', () => {
      return spec()
        .delete('/video/{id}')
        .withPathParams({ id: '$S{videoId}' })
        .withBearerToken('$S{accessToken}')
        .expectStatus(204);
    });
  });
});

describe('BATCH', () => {
  describe('POST /batch', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec().post('/batch').expectStatus(401);
    });

    it('should throw an error if body not provided', () => {
      return spec()
        .post('/batch')
        .withBearerToken('$S{accessToken}')
        .expectStatus(400);
    });

    it('should throw an error if branch code is empty', () => {
      const dto: Omit<CreateBatchDto, 'branchCode'> = {
        batchNumber: 100,
        password: '#BCK100@bck',
      };

      return spec()
        .post('/batch')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if batch number is empty', () => {
      const dto: Omit<CreateBatchDto, 'batchNumber'> = {
        branchCode: 'BCK',
        password: '#BCK100@bck',
      };

      return spec()
        .post('/batch')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should thro an error if password is empty', () => {
      const dto: Omit<CreateBatchDto, 'password'> = {
        branchCode: 'BCK',
        batchNumber: 100,
      };

      return spec()
        .post('/batch')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if password is not strong enough', () => {
      const dto: CreateBatchDto = {
        branchCode: 'BCK',
        batchNumber: 100,
        password: '1234',
      };

      return spec()
        .post('/batch')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should create batch', () => {
      const dto: CreateBatchDto = {
        branchCode: 'BCK',
        batchNumber: 100,
        password: '#BCK100@bck',
      };

      return spec()
        .post('/batch')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(201)
        .stores('batchId', '_id');
    });
  });

  describe('POST /auth/batch', () => {
    it('should throw an error if body not provided', () => {
      return spec().post('/auth/batch').expectStatus(400);
    });

    it('should throw an error if branchCode is empty', () => {
      const dto: Omit<BatchSigninDto, 'branchCode'> = {
        batchNumber: 100,
        password: '#BCK100@bck',
      };

      return spec().post('/auth/batch').withBody(dto).expectStatus(400);
    });

    it('should throw an error if batchNumber is empty', () => {
      const dto: Omit<BatchSigninDto, 'batchNumber'> = {
        branchCode: 'BCK',
        password: '#BCK100@bck',
      };

      return spec().post('/auth/batch').withBody(dto).expectStatus(400);
    });

    it('should throw an error if password is empty', () => {
      const dto: Omit<BatchSigninDto, 'password'> = {
        branchCode: 'BCK',
        batchNumber: 100,
      };

      return spec().post('/auth/batch').withBody(dto).expectStatus(400);
    });

    it('should throw an error if branchCode is incorrect', () => {
      const dto: BatchSigninDto = {
        branchCode: 'BCE',
        batchNumber: 100,
        password: '#BCK100@bck',
      };

      return spec().post('/auth/batch').withBody(dto).expectStatus(404);
    });

    it('should throw an error if batchNumber is incorrect', () => {
      const dto: BatchSigninDto = {
        branchCode: 'BCK',
        batchNumber: 111,
        password: '#BCK100@bck',
      };

      return spec().post('/auth/batch').withBody(dto).expectStatus(404);
    });

    it('should throw an error if password is incorrect', () => {
      const dto: BatchSigninDto = {
        branchCode: 'BCK',
        batchNumber: 100,
        password: '123456',
      };

      return spec().post('/auth/batch').withBody(dto).expectStatus(401);
    });

    it('should signin batch', () => {
      const dto: BatchSigninDto = {
        branchCode: 'BCK',
        batchNumber: 100,
        password: '#BCK100@bck',
      };

      return spec()
        .post('/auth/batch')
        .withBody(dto)
        .expectStatus(200)
        .stores('batchAccessToken', 'access_token')
        .stores('batchRefreshToken', 'refresh_token');
    });
  });

  describe('GET /batch', () => {
    it('should throw an error if no authorization bearer is provided', () => {
      return spec().get('/batch').expectStatus(401);
    });

    it('should get batch', () => {
      return spec()
        .get('/batch')
        .withBearerToken('$S{batchAccessToken}')
        .expectStatus(200);
    });
  });

  describe('GET /batch/:id', () => {
    it('should throw if no authorization bearer is provided', () => {
      return spec()
        .get('/batch/{id}')
        .withPathParams({ id: '$S{batchId}' })
        .expectStatus(401);
    });

    it('should get batch by id', () => {
      return spec()
        .get('/batch/{id}')
        .withPathParams({
          id: '$S{batchId}',
        })
        .withBearerToken('$S{accessToken}')
        .expectStatus(200)
        .expectBodyContains('$S{batchId}');
    });
  });

  describe('POST /auth/batch/refresh', () => {
    it('should throw an error if provided refreshtoken is invalid', () => {
      const dto: TokenDto = {
        token: 'invalid',
      };

      return spec().post('/auth/batch/refresh').withBody(dto).expectStatus(401);
    });

    it('should throw an error if body not provided', () => {
      return spec().post('/auth/batch/refresh').expectStatus(401);
    });

    it('should throw an error if provided refreshtoken is an admin refreshtoken', () => {
      const dto: TokenDto = {
        token: `$S{refreshToken}`,
      };

      return spec()
        .post('/auth/batch/refresh')
        .withBody(dto)
        .expectStatus(401)
        .expectBodyContains('Access denied');
    });

    it('should refresh batch token', () => {
      const dto: TokenDto = {
        token: `$S{batchRefreshToken}`,
      };

      return spec()
        .post('/auth/batch/refresh')
        .withBody(dto)
        .expectStatus(200)
        .stores('batchAccessToken', 'access_token');
    });
  });
});

describe('MANAGE VIDEO', () => {
  describe('POST /video/unlock', () => {
    it('should throw an error if no authorization bearer token is provided', () => {
      return spec().post('/video/unlock').expectStatus(401);
    });

    it('should throw an error if body not provided', () => {
      return spec()
        .post('/video/unlock')
        .withBearerToken('$S{accessToken}')
        .expectStatus(400);
    });

    it('should throw an error if batchId is empty', () => {
      const dto: Omit<ManageVideoDto, 'batchId'> = {
        videoId: '$S{videoId2}',
      };

      return spec()
        .post('/video/unlock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if videoId is empty', () => {
      const dto: Omit<ManageVideoDto, 'videoId'> = {
        batchId: '$S{batchId}',
      };

      return spec()
        .post('/video/unlock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if videoId is invalid', () => {
      const dto: ManageVideoDto = {
        batchId: '$S{batchId}',
        videoId: '$S{batchId}',
      };

      return spec()
        .post('/video/unlock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(404);
    });

    it('should unlock video', () => {
      const dto: ManageVideoDto = {
        batchId: '$S{batchId}',
        videoId: '$S{videoId2}',
      };

      return spec()
        .post('/video/unlock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.batchId)
        .expectBodyContains(dto.videoId);
    });
  });

  describe('POST /video/lock', () => {
    it('should throw an error if no authorization bearer token is provided', () => {
      return spec().post('/video/lock').expectStatus(401);
    });

    it('should throw an error if no body is provided', () => {
      return spec()
        .post('/video/lock')
        .withBearerToken('$S{accessToken}')
        .expectStatus(400);
    });

    it('should throw an error if batchId is empty', () => {
      const dto: Omit<ManageVideoDto, 'batchId'> = {
        videoId: '$S{videoId2}',
      };

      return spec()
        .post('/video/lock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should throw an error if videoId is empty', () => {
      const dto: Omit<ManageVideoDto, 'videoId'> = {
        batchId: '$S{batchId}',
      };

      return spec()
        .post('/video/lock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(400);
    });

    it('should lock video', () => {
      const dto: ManageVideoDto = {
        batchId: '$S{batchId}',
        videoId: '$S{videoId2}',
      };

      return spec()
        .post('/video/lock')
        .withBearerToken('$S{accessToken}')
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.batchId)
        .expectBodyContains(dto.videoId);
    });
  });
});
