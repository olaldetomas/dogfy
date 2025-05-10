import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Delivery,
  PrimitiveDelivery,
  ShippingProvider,
} from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';
import { DeliverySchema } from '../schemas/delivery.schema';

@Injectable()
export class MongoDeliveryRepository extends DeliveryRepository {
  constructor(
    @InjectModel(DeliverySchema.name)
    private deliveryModel: Model<DeliverySchema>,
  ) {
    super();
  }

  async save(delivery: Delivery): Promise<void> {
    const deliveryData = delivery.toValue();

    await this.deliveryModel.findOneAndUpdate(
      { id: deliveryData.id },
      { ...deliveryData },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<Delivery | null> {
    const deliveryDocument = await this.deliveryModel.findOne({ id }).exec();
    if (!deliveryDocument) {
      return null;
    }

    const primitiveDelivery: PrimitiveDelivery = {
      id: deliveryDocument._id.toString(),
      orderId: deliveryDocument.orderId,
      address: deliveryDocument.address,
      provider: deliveryDocument.provider as ShippingProvider,
      trackingNumber: deliveryDocument.trackingNumber,
      labelUrl: deliveryDocument.labelUrl,
      createdAt: deliveryDocument.createdAt,
    };

    return new Delivery(primitiveDelivery);
  }

  async findAll(): Promise<Delivery[]> {
    const deliveryDocuments = await this.deliveryModel.find().exec();

    return deliveryDocuments.map((doc) => {
      const primitiveDelivery: PrimitiveDelivery = {
        id: doc._id.toString(),
        orderId: doc.orderId,
        address: doc.address,
        provider: doc.provider as ShippingProvider,
        trackingNumber: doc.trackingNumber,
        labelUrl: doc.labelUrl,
        createdAt: doc.createdAt,
      };

      return new Delivery(primitiveDelivery);
    });
  }
}
