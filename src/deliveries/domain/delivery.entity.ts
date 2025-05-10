import {
  DeliveryStatus,
  PrimitiveDeliveryStatus,
} from './delivery-status.entity';

export enum ShippingProvider {
  NRW = 'NRW',
  TLS = 'TLS',
}

export interface PrimitiveDelivery {
  id?: string;
  orderId: string;
  address: string;
  provider: ShippingProvider;
  trackingNumber?: string;
  labelUrl?: string;
  statuses: PrimitiveDeliveryStatus[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Delivery {
  constructor(private attributes: PrimitiveDelivery) {}

  static create(createDelivery: {
    orderId: string;
    address: string;
    statuses: DeliveryStatus[];
  }): Delivery {
    return new Delivery({
      orderId: createDelivery.orderId,
      address: createDelivery.address,
      provider: Delivery.selectRandomProvider(),
      statuses: createDelivery.statuses.map((status) => status.toValue()),
    });
  }

  static selectRandomProvider(): ShippingProvider {
    const providers = Object.values(ShippingProvider);
    const randomIndex = Math.floor(Math.random() * providers.length);
    return providers[randomIndex];
  }

  setLabelInfo(trackingNumber: string, labelUrl: string): void {
    this.attributes.trackingNumber = trackingNumber;
    this.attributes.labelUrl = labelUrl;
  }

  toValue(): PrimitiveDelivery {
    return {
      id: this.attributes.id,
      orderId: this.attributes.orderId,
      address: this.attributes.address,
      provider: this.attributes.provider,
      trackingNumber: this.attributes.trackingNumber,
      labelUrl: this.attributes.labelUrl,
      statuses: this.attributes.statuses,
      createdAt: this.attributes.createdAt,
      updatedAt: this.attributes.updatedAt,
    };
  }
}
