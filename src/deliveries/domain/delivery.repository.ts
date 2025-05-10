import { Delivery } from './delivery.entity';
import { PrimitiveDeliveryStatus } from './delivery-status.entity';

export abstract class DeliveryRepository {
  abstract create(delivery: Delivery): Promise<Delivery>;
  abstract addStatus(
    deliveryId: string,
    status: PrimitiveDeliveryStatus,
  ): Promise<Delivery>;
  abstract findAll(): Promise<Delivery[]>;
  abstract findById(id: string): Promise<Delivery | null>;
  abstract findByTrackingNumber(
    trackingNumber: string,
  ): Promise<Delivery | null>;
}
