import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DeliveryRepository } from '../../../deliveries/domain/delivery.repository';
import { DeliveryStatusEnum } from '../../../deliveries/domain/delivery-status.entity';
import { ProviderStatusUpdateDto } from './handle-provider-status-update.dto';

@Injectable()
export class HandleProviderStatusUpdateUseCase {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async execute(dto: ProviderStatusUpdateDto): Promise<void> {
    const delivery = await this.deliveryRepository.findByTrackingNumber(
      dto.trackingNumber,
    );

    if (!delivery) {
      throw new NotFoundException(
        `Delivery with tracking number ${dto.trackingNumber} not found`,
      );
    }

    const statusMap: Record<string, DeliveryStatusEnum> = {
      PENDING: DeliveryStatusEnum.PENDING,
      IN_TRANSIT: DeliveryStatusEnum.IN_TRANSIT,
      DELIVERED: DeliveryStatusEnum.DELIVERED,
      CANCELLED: DeliveryStatusEnum.CANCELLED,
      RETURNED: DeliveryStatusEnum.RETURNED,
    };
    const status = statusMap[dto.status];
    if (!status) {
      throw new BadRequestException(`Invalid status: ${dto.status}`);
    }
    const description = dto.description;

    await this.deliveryRepository.addStatus(delivery.toValue().id as string, {
      status,
      description,
    });
  }
}
