import { Delivery } from './delivery.entity';

export abstract class DeliveryRepository {
  abstract create(delivery: Delivery): Promise<Delivery>;
  abstract update(delivery: Delivery): Promise<Delivery>;
  abstract findAll(): Promise<Delivery[]>;
  abstract findById(id: string): Promise<Delivery | null>;
  abstract findByTrackingNumber(
    trackingNumber: string,
  ): Promise<Delivery | null>;
}
