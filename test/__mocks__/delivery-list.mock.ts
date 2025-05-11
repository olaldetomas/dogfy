import { Delivery } from 'src/deliveries/domain/delivery.entity';

import {
  generateMockDeliveredStatus,
  generateMockInTransitStatus,
  generateMockPendingStatus,
} from './status.mock';

export function generateMockDeliveryWithMultipleStatuses() {
  return {
    toValue: () => ({
      id: 'delivery-1',
      orderId: 'order-1',
      address: '123 Main St',
      provider: 'Provider A',
      trackingNumber: 'track-1',
      labelUrl: 'https://example.com/label-1',
      statuses: [generateMockInTransitStatus(), generateMockPendingStatus()],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  } as unknown as Delivery;
}

export function generateMockDeliveryWithDeliveredStatus() {
  return {
    toValue: () => ({
      id: 'delivery-2',
      orderId: 'order-2',
      address: '456 Oak Ave',
      provider: 'Provider B',
      trackingNumber: 'track-2',
      labelUrl: 'https://example.com/label-2',
      statuses: [generateMockDeliveredStatus()],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  } as unknown as Delivery;
}

export function generateMockDeliveryWithNoStatus() {
  return {
    toValue: () => ({
      id: 'delivery-3',
      orderId: 'order-3',
      address: '789 Pine St',
      provider: 'Provider C',
      trackingNumber: 'track-3',
      labelUrl: 'https://example.com/label-3',
      statuses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  } as unknown as Delivery;
}

export function generateMockDeliveryList() {
  return [
    generateMockDeliveryWithMultipleStatuses(),
    generateMockDeliveryWithDeliveredStatus(),
  ];
}
