import { Injectable } from '@nestjs/common';

import { Delivery, PrimitiveDelivery } from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';
import { CreateDeliveryDto } from './create-delivery.dto';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async run(dto: CreateDeliveryDto): Promise<{ delivery: PrimitiveDelivery }> {
    const delivery = Delivery.create(dto);

    // Simulate label generation for the selected provider
    const trackingNumber = `TRK-${Math.floor(Math.random() * 1000000)}`;
    const labelUrl = `https://shipping-labels.example.com/${delivery.toPrimitives().provider.toLowerCase()}/label-${trackingNumber}.pdf`;

    delivery.setLabelInfo(trackingNumber, labelUrl);

    await this.deliveryRepository.save(delivery);

    return {
      delivery: delivery.toPrimitives(),
    };
  }
}
