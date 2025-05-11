/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllDeliveriesUseCase } from 'src/deliveries/application/find-all-deliveries-use-case/find-all-deliveries-use-case';
import { Delivery } from 'src/deliveries/domain/delivery.entity';
import { DeliveryRepository } from 'src/deliveries/domain/delivery.repository';

import {
  generateMockDeliveryList,
  generateMockDeliveryWithNoStatus,
} from '../../../__mocks__';

describe('FindAllDeliveriesUseCase', () => {
  let useCase: FindAllDeliveriesUseCase;
  let deliveryRepository: DeliveryRepository;
  let mockDeliveries: Delivery[];
  let mockDeliveryNoStatus: Delivery[];

  beforeEach(async () => {
    mockDeliveries = generateMockDeliveryList();
    mockDeliveryNoStatus = [generateMockDeliveryWithNoStatus()];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllDeliveriesUseCase,
        {
          provide: DeliveryRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllDeliveriesUseCase>(FindAllDeliveriesUseCase);
    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all deliveries with mapped statuses', async () => {
      jest
        .spyOn(deliveryRepository, 'findAll')
        .mockResolvedValue(mockDeliveries);

      const result = await useCase.execute();
      const delivery1 = mockDeliveries[0].toValue();
      const delivery2 = mockDeliveries[1].toValue();

      expect(deliveryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        expect.objectContaining({
          id: delivery1.id,
          orderId: delivery1.orderId,
          address: delivery1.address,
          provider: delivery1.provider,
          trackingNumber: delivery1.trackingNumber,
          labelUrl: delivery1.labelUrl,
          statuses: expect.arrayContaining([
            expect.objectContaining({
              status: delivery1.statuses[0].status,
              description: delivery1.statuses[0].description,
            }),
          ]),
        }),
        expect.objectContaining({
          id: delivery2.id,
          orderId: delivery2.orderId,
          address: delivery2.address,
          provider: delivery2.provider,
          trackingNumber: delivery2.trackingNumber,
          labelUrl: delivery2.labelUrl,
          statuses: expect.arrayContaining([
            expect.objectContaining({
              status: delivery2.statuses[0].status,
              description: delivery2.statuses[0].description,
            }),
          ]),
        }),
      ]);
    });

    it('should return an empty array when no deliveries exist', async () => {
      jest.spyOn(deliveryRepository, 'findAll').mockResolvedValue([]);

      const result = await useCase.execute();

      expect(deliveryRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle deliveries with no statuses', async () => {
      jest
        .spyOn(deliveryRepository, 'findAll')
        .mockResolvedValue(mockDeliveryNoStatus);

      const result = await useCase.execute();
      const delivery = mockDeliveryNoStatus[0].toValue();

      expect(result).toEqual([
        expect.objectContaining({
          id: delivery.id,
          orderId: delivery.orderId,
          address: delivery.address,
          provider: delivery.provider,
          trackingNumber: delivery.trackingNumber,
          labelUrl: delivery.labelUrl,
          statuses: [],
        }),
      ]);
    });
  });
});
