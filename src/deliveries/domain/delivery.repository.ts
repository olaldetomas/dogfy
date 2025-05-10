import { Delivery } from './delivery.entity';

export abstract class DeliveryRepository {
  abstract save(delivery: Delivery): Promise<Delivery>;
  abstract findAll(): Promise<Delivery[]>;
}
