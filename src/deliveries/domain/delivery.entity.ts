import { v4 } from 'uuid';

export enum ShippingProvider {
  NRW = 'NRW',
  TLS = 'TLS',
}

export interface PrimitiveDelivery {
  id: string;
  orderId: string;
  address: string;
  provider: ShippingProvider;
  trackingNumber?: string;
  labelUrl?: string;
  createdAt: Date;
}

export class Delivery {
  constructor(private attributes: PrimitiveDelivery) {}

  static create(createDelivery: {
    orderId: string;
    address: string;
    provider?: ShippingProvider;
  }): Delivery {
    const provider = createDelivery.provider || Delivery.selectRandomProvider();

    return new Delivery({
      id: v4(),
      orderId: createDelivery.orderId,
      address: createDelivery.address,
      provider,
      createdAt: new Date(),
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

  toPrimitives(): PrimitiveDelivery {
    return { ...this.attributes };
  }
}
