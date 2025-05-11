import {
  Delivery,
  ShippingProvider,
} from 'src/deliveries/domain/delivery.entity';
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from 'src/deliveries/domain/delivery-status.entity';

export function generateMockDelivery(overrides = {}) {
  return Delivery.create({
    orderId: 'order123',
    address: '123 Main St',
    statuses: [DeliveryStatus.createPending()],
    ...overrides,
  });
}

export function generateDeliveryResponseDto(overrides = {}) {
  return {
    id: 'delivery123',
    orderId: 'order123',
    address: '123 Main St',
    provider: ShippingProvider.NRW,
    trackingNumber: 'TRK123456',
    labelUrl: 'https://example.com/label.pdf',
    statuses: [
      {
        id: 'status-1',
        status: DeliveryStatusEnum.PENDING,
        description: 'Delivery is pending processing',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
