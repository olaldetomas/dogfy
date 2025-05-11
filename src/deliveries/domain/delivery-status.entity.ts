export interface PrimitiveDeliveryStatus {
  id?: string;
  status: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DeliveryStatusEnum {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export class DeliveryStatus {
  constructor(private attributes: PrimitiveDeliveryStatus) {}

  static create(createStatus: {
    status: string;
    description: string;
  }): DeliveryStatus {
    return new DeliveryStatus({
      status: createStatus.status,
      description: createStatus.description,
    });
  }

  static createPending(): DeliveryStatus {
    return new DeliveryStatus({
      status: DeliveryStatusEnum.PENDING,
      description: 'Delivery is pending processing',
    });
  }

  toValue(): PrimitiveDeliveryStatus {
    return {
      id: this.attributes.id,
      status: this.attributes.status,
      description: this.attributes.description,
      createdAt: this.attributes.createdAt,
      updatedAt: this.attributes.updatedAt,
    };
  }
}
