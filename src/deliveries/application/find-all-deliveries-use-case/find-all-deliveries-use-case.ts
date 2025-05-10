import { Injectable } from '@nestjs/common';

import { PrimitiveDelivery } from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';

@Injectable()
export class FindAllDeliveriesUseCase {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async run(): Promise<{ deliveries: PrimitiveDelivery[] }> {
    const deliveries = await this.deliveryRepository.findAll();

    return {
      deliveries: deliveries.map((delivery) => delivery.toValue()),
    };
  }
}
