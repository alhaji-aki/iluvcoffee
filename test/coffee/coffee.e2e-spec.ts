import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dtos/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  let app: INestApplication;

  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          database: 'postgres',
          username: 'postgres',
          password: 'pass123',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  it('Create coffee [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });
  it('Get all coffees [GET /]', () => {
    return request(app.getHttpServer()).get('/coffees').expect(HttpStatus.OK);
  });
  it.todo('Get one coffee [GET /:id]');
  it.todo('Update coffee [PATCH /:id]');
  it.todo('Delete coffee [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
