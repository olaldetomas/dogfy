import { Injectable } from '@nestjs/common';
import { Delivery } from 'src/deliveries/domain/delivery.entity';

import { DeliveryRepository } from '../../domain/delivery.repository';
import { FindAllDeliveriesUseCaseDto } from './find-all-deliveries-use-case.dto';

@Injectable()
export class FindAllDeliveriesUseCase {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async execute(): Promise<FindAllDeliveriesUseCaseDto[]> {
    const deliveries = await this.deliveryRepository.findAll();
    return deliveries.map((delivery: Delivery) => {
      const deliveryValue = delivery.toValue();
      return {
        id: deliveryValue.id as string,
        orderId: deliveryValue.orderId,
        address: deliveryValue.address,
        provider: deliveryValue.provider,
        trackingNumber: deliveryValue.trackingNumber as string,
        labelUrl: deliveryValue.labelUrl as string,
        statuses: deliveryValue.statuses.map((status) => {
          return {
            status: status.status,
            description: status.description,
          };
        }),
      };
    });
  }
}
