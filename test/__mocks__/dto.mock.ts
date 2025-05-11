import { CreateDeliveryDto } from 'src/deliveries/application/get-latest-status-by-id-use-case/create-delivery.dto';

export function generateCreateDeliveryDto(overrides = {}): CreateDeliveryDto {
  return {
    orderId: 'order123',
    address: '123 Main St',
    ...overrides,
  };
}
