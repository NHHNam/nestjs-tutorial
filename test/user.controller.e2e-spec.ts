import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const resposneData = {
  status: 200,
  page: 1,
  show: 10,
  metadata: [
    {
      id: '61a432b6-9601-4d18-945e-661b188535e7',
      email: 'nam',
      role: 'admin',
      createdAt: '2023-10-06T21:24:20.147Z',
      updatedAt: '2023-10-06T22:23:00.000Z',
      payment: {
        id: '6481cfa8-0c92-4255-8286-fca9076a18b5',
        createdAt: '2023-10-06T22:23:00.004Z',
        updatedAt: '2023-10-06T22:23:00.004Z',
        deletedAt: null,
        fullName: 'Hoai Nam',
        cardNumber: '12321312312312',
        nameBank: 'ACB',
      },
      bills: [
        {
          id: '166c0420-f6b1-464b-9677-ac16d252ca36',
          createdAt: '2023-10-06T21:25:45.689Z',
          updatedAt: '2023-10-06T21:25:45.689Z',
          deletedAt: null,
          typeBill: 'others',
          quantity: 10,
          status: 'pending',
        },
        {
          id: 'ceed99ef-1eab-4aca-8496-1384a0752513',
          createdAt: '2023-10-06T21:27:18.676Z',
          updatedAt: '2023-10-06T21:27:18.676Z',
          deletedAt: null,
          typeBill: 'topup',
          quantity: 10,
          status: 'pending',
        },
      ],
      posts: [],
    },
  ],
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/admin/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/users')
      .expect(resposneData);
  });
});
