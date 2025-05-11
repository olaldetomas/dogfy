/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Delivery } from 'src/deliveries/domain/delivery.entity';
import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';
import { MongoDeliveryRepository } from 'src/deliveries/infrastructure/repositories/delivery.repository';
import { DeliverySchema } from 'src/deliveries/infrastructure/schemas/delivery.schema';
import { DeliveryStatusSchema } from 'src/deliveries/infrastructure/schemas/delivery-status.schema';

describe('MongoDeliveryRepository', () => {
  let repository: MongoDeliveryRepository;
  let deliveryModel: Model<DeliverySchema>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDeliveryRepository,
        {
          provide: getModelToken(DeliverySchema.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(DeliveryStatusSchema.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MongoDeliveryRepository>(MongoDeliveryRepository);
    deliveryModel = module.get<Model<DeliverySchema>>(
      getModelToken(DeliverySchema.name),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new delivery', async () => {
      const deliveryEntity = Delivery.create({
        orderId: 'order-123',
        address: '123 Main St',
        statuses: [],
      });
      deliveryEntity.setLabelInfo('track-123', 'https://example.com/label');

      const mockCreatedDelivery = {
        _id: 'delivery-123',
        orderId: 'order-123',
        address: '123 Main St',
        provider: deliveryEntity.toValue().provider,
        trackingNumber: 'track-123',
        labelUrl: 'https://example.com/label',
        statuses: [],
      };

      // Mock implementation with any type
      (deliveryModel.create as any).mockImplementation(
        () => mockCreatedDelivery,
      );

      const result = await repository.create(deliveryEntity);

      expect(deliveryModel.create).toHaveBeenCalledWith({
        orderId: 'order-123',
        address: '123 Main St',
        provider: deliveryEntity.toValue().provider,
        trackingNumber: 'track-123',
        labelUrl: 'https://example.com/label',
        statuses: [],
      });
      expect(result).toBeInstanceOf(Delivery);
      expect(result.toValue().id).toBe('delivery-123');
    });
  });

  describe('findAll', () => {
    it('should return all deliveries', async () => {
      const mockDeliveries = [
        {
          _id: 'delivery-1',
          orderId: 'order-1',
          address: '123 Main St',
          provider: 'TLS',
          trackingNumber: 'track-1',
          labelUrl: 'https://example.com/label-1',
          statuses: [
            {
              status: DeliveryStatusEnum.IN_TRANSIT,
              description: 'On the way',
            },
          ],
        },
        {
          _id: 'delivery-2',
          orderId: 'order-2',
          address: '456 Oak Ave',
          provider: 'NRW',
          trackingNumber: 'track-2',
          labelUrl: 'https://example.com/label-2',
          statuses: [],
        },
      ];

      (deliveryModel.find as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDeliveries),
      });

      const result = await repository.findAll();

      expect(deliveryModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Delivery);
      expect(result[0].toValue().id).toBe('delivery-1');
      expect(result[1].toValue().id).toBe('delivery-2');
    });
  });

  describe('findById', () => {
    it('should find a delivery by ID', async () => {
      const deliveryId = 'delivery-123';
      const mockDelivery = {
        _id: deliveryId,
        orderId: 'order-123',
        address: '123 Main St',
        provider: 'TLS',
        trackingNumber: 'track-123',
        labelUrl: 'https://example.com/label',
        statuses: [
          {
            status: DeliveryStatusEnum.PENDING,
            description: 'Preparing shipment',
          },
        ],
      };

      (deliveryModel.findById as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDelivery),
      });

      const result = await repository.findById(deliveryId);

      expect(deliveryModel.findById).toHaveBeenCalledWith(deliveryId);
      expect(result).toBeInstanceOf(Delivery);
      expect(result?.toValue().id).toBe(deliveryId);
    });

    it('should return null if delivery not found', async () => {
      const deliveryId = 'non-existent-id';

      (deliveryModel.findById as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findById(deliveryId);

      expect(deliveryModel.findById).toHaveBeenCalledWith(deliveryId);
      expect(result).toBeNull();
    });
  });

  describe('findByTrackingNumber', () => {
    it('should find a delivery by tracking number', async () => {
      const trackingNumber = 'track-123';
      const mockDelivery = {
        _id: 'delivery-123',
        orderId: 'order-123',
        address: '123 Main St',
        provider: 'TLS',
        trackingNumber,
        labelUrl: 'https://example.com/label',
        statuses: [],
      };

      (deliveryModel.findOne as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDelivery),
      });

      const result = await repository.findByTrackingNumber(trackingNumber);

      expect(deliveryModel.findOne).toHaveBeenCalledWith({ trackingNumber });
      expect(result).toBeInstanceOf(Delivery);
      expect(result?.toValue().trackingNumber).toBe(trackingNumber);
    });

    it('should return null if tracking number not found', async () => {
      const trackingNumber = 'non-existent-track';

      (deliveryModel.findOne as any).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.findByTrackingNumber(trackingNumber);

      expect(deliveryModel.findOne).toHaveBeenCalledWith({ trackingNumber });
      expect(result).toBeNull();
    });
  });

  describe('addStatus', () => {
    it('should add a status to a delivery', async () => {
      const deliveryId = 'delivery-123';
      const statusData = {
        status: DeliveryStatusEnum.IN_TRANSIT,
        description: 'Package is on the way',
      };

      const mockUpdatedDelivery = {
        _id: deliveryId,
        orderId: 'order-123',
        address: '123 Main St',
        provider: 'TLS',
        trackingNumber: 'track-123',
        labelUrl: 'https://example.com/label',
        statuses: [
          {
            status: DeliveryStatusEnum.IN_TRANSIT,
            description: 'Package is on the way',
          },
        ],
      };

      (deliveryModel.findByIdAndUpdate as any).mockResolvedValue(
        mockUpdatedDelivery,
      );

      const result = await repository.addStatus(deliveryId, statusData);

      expect(deliveryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        deliveryId,
        {
          $push: {
            statuses: {
              status: statusData.status,
              description: statusData.description,
            },
          },
        },
        { new: true },
      );
      expect(result).toBeInstanceOf(Delivery);
      expect(result.toValue().id).toBe(deliveryId);
    });

    it('should throw an error if delivery update fails', async () => {
      const deliveryId = 'delivery-123';
      const statusData = {
        status: DeliveryStatusEnum.IN_TRANSIT,
        description: 'Package is on the way',
      };

      (deliveryModel.findByIdAndUpdate as any).mockResolvedValue(null);

      await expect(
        repository.addStatus(deliveryId, statusData),
      ).rejects.toThrow('Error updating delivery');
    });
  });
});
