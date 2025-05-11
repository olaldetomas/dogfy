/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication, LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../src/app.module';
import {
  PrimitiveDelivery,
  ShippingProvider,
} from '../../../src/deliveries/domain/delivery.entity';
import { ProviderService } from '../../../src/providers/domain/provider.service';
import {
  generateDeliveryResponseDto,
  generateMockLabelResponse,
} from '../../__mocks__';

// Custom silent logger for tests
class SilentLogger implements LoggerService {
  log(): void {}
  error(): void {}
  warn(): void {}
  debug(): void {}
  verbose(): void {}
}

describe('Deliveries API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProviderService)
      .useValue({
        generateLabel: jest.fn().mockImplementation(() => {
          return generateMockLabelResponse();
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(new SilentLogger());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/deliveries (POST)', () => {
    it('should create a new delivery', () => {
      const createDeliveryDto = generateDeliveryResponseDto();

      return request(app.getHttpServer())
        .post('/deliveries')
        .send(createDeliveryDto)
        .expect(201)
        .then((response) => {
          const body = response.body as PrimitiveDelivery;
          expect(body).toHaveProperty('id');
          expect(body.orderId).toBe(createDeliveryDto.orderId);
          expect(body.address).toBe(createDeliveryDto.address);
          expect(body).toHaveProperty('provider');
          expect(Object.values(ShippingProvider)).toContain(body.provider);
          expect(body).toHaveProperty('trackingNumber');
          expect(body).toHaveProperty('labelUrl');
          expect(body).toHaveProperty('statuses');
          expect(body.statuses).toBeInstanceOf(Array);
          expect(body.statuses.length).toBeGreaterThan(0);
          expect(body.statuses[0]).toHaveProperty('status', 'PENDING');
        });
    });

    it('should return error for invalid delivery data', () => {
      const invalidDeliveryDto = {
        address: '123 Test St, Test City',
      };

      return request(app.getHttpServer())
        .post('/deliveries')
        .send(invalidDeliveryDto)
        .expect(500);
    });
  });
});
