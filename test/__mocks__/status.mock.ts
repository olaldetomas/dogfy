import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';

export function generateMockPendingStatus(overrides = {}) {
  return {
    id: 'status-1',
    status: DeliveryStatusEnum.PENDING,
    description: 'Delivery is pending processing',
    createdAt: new Date('2023-08-13T09:00:00Z'),
    updatedAt: new Date('2023-08-13T09:00:00Z'),
    ...overrides,
  };
}

export function generateMockInTransitStatus(overrides = {}) {
  return {
    id: 'status-2',
    status: DeliveryStatusEnum.IN_TRANSIT,
    description: 'On the way',
    createdAt: new Date('2023-08-14T10:00:00Z'),
    updatedAt: new Date('2023-08-14T10:00:00Z'),
    ...overrides,
  };
}

export function generateMockDeliveredStatus(overrides = {}) {
  return {
    id: 'status-3',
    status: DeliveryStatusEnum.DELIVERED,
    description: 'Delivery completed',
    createdAt: new Date('2023-08-15T14:00:00Z'),
    updatedAt: new Date('2023-08-15T14:00:00Z'),
    ...overrides,
  };
}
