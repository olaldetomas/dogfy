import { Delivery } from './delivery.entity';

export abstract class DeliveryRepository {
  abstract save(delivery: Delivery): Promise<void>;
  abstract findById(id: string): Promise<Delivery | null>;
  abstract findAll(): Promise<Delivery[]>;
}
