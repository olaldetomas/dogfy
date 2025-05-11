/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetLatestStatusByIdUseCase } from 'src/deliveries/application/get-latest-status-by-id-use-case/get-latest-status-by-id-use-case';
import { Delivery } from 'src/deliveries/domain/delivery.entity';
import { DeliveryRepository } from 'src/deliveries/domain/delivery.repository';
import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';

import {
  generateMockDeliveredStatus,
  generateMockDeliveryWithDeliveredStatus,
  generateMockDeliveryWithNoStatus,
} from '../../../__mocks__';

describe('GetLatestStatusByIdUseCase', () => {
  let useCase: GetLatestStatusByIdUseCase;
  let deliveryRepository: DeliveryRepository;
  let mockDelivery: Delivery;
  let mockDeliveryNoStatuses: Delivery;
  const deliveryId = 'test-id';

  beforeEach(async () => {
    mockDelivery = generateMockDeliveryWithDeliveredStatus();
    mockDeliveryNoStatuses = generateMockDeliveryWithNoStatus();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLatestStatusByIdUseCase,
        {
          provide: DeliveryRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetLatestStatusByIdUseCase>(
      GetLatestStatusByIdUseCase,
    );
    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return the latest status for a delivery', async () => {
      jest
        .spyOn(deliveryRepository, 'findById')
        .mockResolvedValue(mockDelivery);

      const result = await useCase.execute(deliveryId);

      expect(deliveryRepository.findById).toHaveBeenCalledWith(deliveryId);
      expect(result).toEqual({
        status: DeliveryStatusEnum.DELIVERED,
        description: 'Delivery completed',
      });
    });

    it('should throw NotFoundException if delivery is not found', async () => {
      jest.spyOn(deliveryRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute(deliveryId)).rejects.toThrow(
        new NotFoundException(`Delivery with ID ${deliveryId} not found`),
      );
    });

    it('should throw NotFoundException if delivery has no statuses', async () => {
      jest
        .spyOn(deliveryRepository, 'findById')
        .mockResolvedValue(mockDeliveryNoStatuses);

      await expect(useCase.execute(deliveryId)).rejects.toThrow(
        new NotFoundException(
          `No status found for delivery with ID ${deliveryId}`,
        ),
      );
    });

    it('should correctly sort statuses by date to find the latest one', async () => {
      const mockDeliveryValue = mockDelivery.toValue();

      const mockDeliveryWithSortedStatuses = {
        toValue: jest.fn().mockReturnValue({
          ...mockDeliveryValue,
          statuses: [
            {
              ...generateMockDeliveredStatus(),
              createdAt: new Date('2023-08-15T14:00:00Z'),
            },
            {
              ...generateMockDeliveredStatus(),
              createdAt: new Date('2023-08-13T09:00:00Z'),
            },
            {
              ...generateMockDeliveredStatus(),
              createdAt: new Date('2023-08-14T10:00:00Z'),
            },
          ],
        }),
      } as unknown as Delivery;

      jest
        .spyOn(deliveryRepository, 'findById')
        .mockResolvedValue(mockDeliveryWithSortedStatuses);

      const result = await useCase.execute(deliveryId);

      expect(result).toEqual({
        status: DeliveryStatusEnum.DELIVERED,
        description: 'Delivery completed',
      });
    });
  });
});
