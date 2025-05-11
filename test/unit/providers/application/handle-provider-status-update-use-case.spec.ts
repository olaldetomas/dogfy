/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Delivery } from 'src/deliveries/domain/delivery.entity';
import { DeliveryRepository } from 'src/deliveries/domain/delivery.repository';
import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';
import { ProviderStatusUpdateDto } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update.dto';
import { HandleProviderStatusUpdateUseCase } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';

describe('HandleProviderStatusUpdateUseCase', () => {
  let useCase: HandleProviderStatusUpdateUseCase;
  let deliveryRepository: DeliveryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleProviderStatusUpdateUseCase,
        {
          provide: DeliveryRepository,
          useValue: {
            findByTrackingNumber: jest.fn(),
            addStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<HandleProviderStatusUpdateUseCase>(
      HandleProviderStatusUpdateUseCase,
    );
    deliveryRepository = module.get<DeliveryRepository>(DeliveryRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const trackingNumber = 'tracking-123';
    const deliveryId = 'delivery-123';
    const mockDelivery = {
      toValue: jest.fn().mockReturnValue({
        id: deliveryId,
        trackingNumber,
      }),
    };

    const mockUpdatedDelivery = {
      toValue: jest.fn().mockReturnValue({
        id: deliveryId,
        trackingNumber,
        statuses: [
          {
            status: DeliveryStatusEnum.IN_TRANSIT,
            description: 'Package is on the way',
          },
        ],
      }),
    };

    it('should update delivery status successfully', async () => {
      const dto: ProviderStatusUpdateDto = {
        trackingNumber,
        status: 'IN_TRANSIT',
        description: 'Package is on the way',
      };

      jest
        .spyOn(deliveryRepository, 'findByTrackingNumber')
        .mockResolvedValue(mockDelivery as unknown as Delivery);
      jest
        .spyOn(deliveryRepository, 'addStatus')
        .mockResolvedValue(mockUpdatedDelivery as unknown as Delivery);

      await useCase.execute(dto);

      expect(deliveryRepository.findByTrackingNumber).toHaveBeenCalledWith(
        trackingNumber,
      );
      expect(deliveryRepository.addStatus).toHaveBeenCalledWith(deliveryId, {
        status: DeliveryStatusEnum.IN_TRANSIT,
        description: 'Package is on the way',
      });
    });

    it('should throw NotFoundException if delivery is not found', async () => {
      const dto: ProviderStatusUpdateDto = {
        trackingNumber,
        status: 'IN_TRANSIT',
        description: 'Package is on the way',
      };

      jest
        .spyOn(deliveryRepository, 'findByTrackingNumber')
        .mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        new NotFoundException(
          `Delivery with tracking number ${trackingNumber} not found`,
        ),
      );
      expect(deliveryRepository.addStatus).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid status', async () => {
      const dto: ProviderStatusUpdateDto = {
        trackingNumber,
        status: 'INVALID_STATUS',
        description: 'Status description',
      };

      jest
        .spyOn(deliveryRepository, 'findByTrackingNumber')
        .mockResolvedValue(mockDelivery as unknown as Delivery);

      await expect(useCase.execute(dto)).rejects.toThrow(
        new BadRequestException(`Invalid status: ${dto.status}`),
      );
      expect(deliveryRepository.addStatus).not.toHaveBeenCalled();
    });

    it('should handle each valid status type correctly', async () => {
      const validStatuses = [
        { input: 'PENDING', expected: DeliveryStatusEnum.PENDING },
        { input: 'IN_TRANSIT', expected: DeliveryStatusEnum.IN_TRANSIT },
        { input: 'DELIVERED', expected: DeliveryStatusEnum.DELIVERED },
        { input: 'CANCELLED', expected: DeliveryStatusEnum.CANCELLED },
        { input: 'RETURNED', expected: DeliveryStatusEnum.RETURNED },
      ];

      jest
        .spyOn(deliveryRepository, 'findByTrackingNumber')
        .mockResolvedValue(mockDelivery as unknown as Delivery);
      jest
        .spyOn(deliveryRepository, 'addStatus')
        .mockResolvedValue(mockUpdatedDelivery as unknown as Delivery);

      for (const { input, expected } of validStatuses) {
        const dto: ProviderStatusUpdateDto = {
          trackingNumber,
          status: input,
          description: `Status is ${input}`,
        };

        await useCase.execute(dto);

        expect(deliveryRepository.addStatus).toHaveBeenCalledWith(deliveryId, {
          status: expected,
          description: `Status is ${input}`,
        });
      }
    });
  });
});
