import { Injectable } from '@nestjs/common';
import { ProviderService } from 'src/providers/domain/provider.service';

import { Delivery, PrimitiveDelivery } from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';
import { DeliveryStatus } from '../../domain/delivery-status.entity';
import { CreateDeliveryDto } from '../get-latest-status-by-id-use-case/create-delivery.dto';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly providerService: ProviderService,
  ) {}

  async execute(dto: CreateDeliveryDto): Promise<PrimitiveDelivery> {
    const delivery = Delivery.create({
      orderId: dto.orderId,
      address: dto.address,
      statuses: [DeliveryStatus.createPending()],
    });

    // the delivery has the selected provider, randomly selected
    const { trackingNumber, labelUrl } =
      await this.providerService.generateLabel(delivery);

    delivery.setLabelInfo(trackingNumber, labelUrl);

    const savedDelivery = await this.deliveryRepository.create(delivery);
    return savedDelivery.toValue();
  }
}
