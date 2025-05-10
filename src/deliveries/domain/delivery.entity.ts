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

/**
 * Represents a delivery entity.
 * @class Delivery
 * @param {PrimitiveDelivery} attributes - The attributes of the delivery.
 */
export class Delivery {
  constructor(private attributes: PrimitiveDelivery) {}

  /**
   * Creates a new delivery.
   * @param {Object} createDelivery - The delivery data.
   * @param {string} createDelivery.orderId - The order ID.
   * @param {string} createDelivery.address - The delivery address.
   * @returns {Delivery} A new delivery instance.
   */
  static create(createDelivery: {
    orderId: string;
    address: string;
  }): Delivery {
    return new Delivery({
      id: v4(),
      orderId: createDelivery.orderId,
      address: createDelivery.address,
      provider: Delivery.selectRandomProvider(),
      createdAt: new Date(),
    });
  }

  /**
   * Selects a random shipping provider.
   * @returns {ShippingProvider} A random shipping provider.
   */
  static selectRandomProvider(): ShippingProvider {
    const providers = Object.values(ShippingProvider);
    const randomIndex = Math.floor(Math.random() * providers.length);
    return providers[randomIndex];
  }

  /**
   * Sets the label information for the delivery.
   * @param {string} trackingNumber - The tracking number for the delivery.
   * @param {string} labelUrl - The URL of the label for the delivery.
   */
  setLabelInfo(trackingNumber: string, labelUrl: string): void {
    this.attributes.trackingNumber = trackingNumber;
    this.attributes.labelUrl = labelUrl;
  }

  /**
   * Returns the primitive representation of the delivery.
   * @returns {PrimitiveDelivery} The primitive representation of the delivery.
   */
  toValue(): PrimitiveDelivery {
    return { ...this.attributes };
  }
}
