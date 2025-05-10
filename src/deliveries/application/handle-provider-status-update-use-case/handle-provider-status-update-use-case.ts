import { Injectable, NotFoundException } from '@nestjs/common';

import { Delivery } from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../domain/delivery-status.entity';
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
      OUT_FOR_DELIVERY: DeliveryStatusEnum.IN_TRANSIT,
      DELIVERED: DeliveryStatusEnum.DELIVERED,
      CANCELLED: DeliveryStatusEnum.CANCELLED,
    };
    const status = statusMap[dto.status] || DeliveryStatusEnum.IN_TRANSIT;
    const description = dto.description;

    const newStatus = DeliveryStatus.create({
      status,
      description,
    });

    const deliveryValue = delivery.toValue();
    deliveryValue.statuses.push(newStatus.toValue());
    deliveryValue.updatedAt = new Date();
    const updatedDelivery = new Delivery(deliveryValue);

    await this.deliveryRepository.update(updatedDelivery);
  }
}
