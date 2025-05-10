import { Injectable } from '@nestjs/common';

import { Delivery, PrimitiveDelivery } from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';
import { DeliveryStatus } from '../../domain/delivery-status.entity';
import { CreateDeliveryDto } from '../get-latest-status-by-id-use-case/create-delivery.dto';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async execute(dto: CreateDeliveryDto): Promise<PrimitiveDelivery> {
    const delivery = Delivery.create({
      ...dto,
      statuses: [DeliveryStatus.createPending()],
    });

    const trackingNumber = `TRK-${Math.floor(Math.random() * 1000000)}`;
    const labelUrl = `https://shipping-labels.example.com/${delivery.toValue().provider.toLowerCase()}/label-${trackingNumber}.pdf`;

    delivery.setLabelInfo(trackingNumber, labelUrl);

    const savedDelivery = await this.deliveryRepository.create(delivery);
    return savedDelivery.toValue();
  }
}
