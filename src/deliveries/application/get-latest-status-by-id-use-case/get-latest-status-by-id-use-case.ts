import { Injectable, NotFoundException } from '@nestjs/common';

import { DeliveryRepository } from '../../domain/delivery.repository';
import { GetLatestStatusByIdUseCaseDto } from './get-latest-status-by-id-use-case.dto';

@Injectable()
export class GetLatestStatusByIdUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  async execute(id: string): Promise<GetLatestStatusByIdUseCaseDto> {
    const delivery = await this.deliveryRepository.findById(id);

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    const deliveryValue = delivery.toValue();
    if (!deliveryValue.statuses || deliveryValue.statuses.length === 0) {
      throw new NotFoundException(`No status found for delivery with ID ${id}`);
    }

    const sortedStatuses = [...deliveryValue.statuses].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestStatus = sortedStatuses[0];
    return {
      status: latestStatus.status,
      description: latestStatus.description,
      createdAt: latestStatus.createdAt,
      updatedAt: latestStatus.updatedAt,
    };
  }
}
