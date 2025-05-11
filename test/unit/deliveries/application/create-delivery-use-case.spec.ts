/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { CreateDeliveryDto } from 'src/deliveries/application/get-latest-status-by-id-use-case/create-delivery.dto';
import { GenerateLabelDto } from 'src/providers/domain/generate-label.dto';

import { CreateDeliveryUseCase } from '../../../../src/deliveries/application/create-delivery-use-case/create-delivery-use-case';
import {
  Delivery,
  PrimitiveDelivery,
} from '../../../../src/deliveries/domain/delivery.entity';
import { DeliveryRepository } from '../../../../src/deliveries/domain/delivery.repository';
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../../../src/deliveries/domain/delivery-status.entity';
import { ProviderService } from '../../../../src/providers/domain/provider.service';
import {
  generateCreateDeliveryDto,
  generateDeliveryResponseDto,
  generateMockDelivery,
  generateMockLabelResponse,
} from '../../../__mocks__';

describe('CreateDeliveryUseCase', () => {
  let createDeliveryUseCase: CreateDeliveryUseCase;
  let deliveryRepository: DeliveryRepository;
  let providerService: ProviderService;
  let mockDelivery: Delivery;
  let mockLabelResponse: GenerateLabelDto;
  let mockResponseData: PrimitiveDelivery;
  let createDeliveryDto: CreateDeliveryDto;

  beforeEach(async () => {
    createDeliveryDto = generateCreateDeliveryDto();
    mockDelivery = generateMockDelivery();
    mockLabelResponse = generateMockLabelResponse();
    mockResponseData = generateDeliveryResponseDto();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateDeliveryUseCase,
        {
          provide: DeliveryRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDelivery),
          },
        },
        {
          provide: ProviderService,
          useValue: {
            generateLabel: jest.fn().mockResolvedValue(mockLabelResponse),
          },
        },
      ],
    }).compile();

    createDeliveryUseCase = moduleRef.get<CreateDeliveryUseCase>(
      CreateDeliveryUseCase,
    );

    deliveryRepository = moduleRef.get<DeliveryRepository>(DeliveryRepository);
    providerService = moduleRef.get<ProviderService>(ProviderService);
    jest.spyOn(Delivery, 'create').mockReturnValue(mockDelivery);
    jest.spyOn(mockDelivery, 'setLabelInfo');
    jest.spyOn(mockDelivery, 'toValue').mockReturnValue(mockResponseData);
  });

  describe('execute', () => {
    let result: PrimitiveDelivery;

    beforeEach(async () => {
      result = await createDeliveryUseCase.execute(createDeliveryDto);
    });

    it('should create a delivery successfully', () => {
      expect(Delivery.create).toHaveBeenCalledWith({
        orderId: createDeliveryDto.orderId,
        address: createDeliveryDto.address,
        statuses: [expect.any(DeliveryStatus)],
      });
      expect(providerService.generateLabel).toHaveBeenCalledWith(mockDelivery);
      expect(mockDelivery.setLabelInfo).toHaveBeenCalledWith(
        mockLabelResponse.trackingNumber,
        mockLabelResponse.labelUrl,
      );
      expect(deliveryRepository.create).toHaveBeenCalledWith(mockDelivery);
      expect(mockDelivery.toValue).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          id: mockResponseData.id,
          orderId: mockResponseData.orderId,
          address: mockResponseData.address,
          provider: mockResponseData.provider,
          trackingNumber: mockResponseData.trackingNumber,
          labelUrl: mockResponseData.labelUrl,
          statuses: [
            expect.objectContaining({
              status: DeliveryStatusEnum.PENDING,
              description: 'Delivery is pending processing',
            }),
          ],
        }),
      );
    });
  });
});
