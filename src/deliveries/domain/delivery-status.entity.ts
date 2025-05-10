import { v4 } from 'uuid';

export interface PrimitiveDeliveryStatus {
  id: string;
  status: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryStatusEnum {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class DeliveryStatus {
  constructor(private attributes: PrimitiveDeliveryStatus) {}

  static create(createStatus: {
    status: string;
    description: string;
  }): DeliveryStatus {
    return new DeliveryStatus({
      id: v4(),
      status: createStatus.status,
      description: createStatus.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createPending(): DeliveryStatus {
    return new DeliveryStatus({
      id: v4(),
      status: DeliveryStatusEnum.PENDING,
      description: 'Delivery is pending processing',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toValue(): PrimitiveDeliveryStatus {
    return {
      ...this.attributes,
    };
  }
}
