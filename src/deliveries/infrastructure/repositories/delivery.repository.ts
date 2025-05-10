import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Delivery, ShippingProvider } from '../../domain/delivery.entity';
import { DeliveryRepository } from '../../domain/delivery.repository';
import { PrimitiveDeliveryStatus } from '../../domain/delivery-status.entity';
import { DeliverySchema } from '../schemas/delivery.schema';

@Injectable()
export class MongoDeliveryRepository extends DeliveryRepository {
  constructor(
    @InjectModel(DeliverySchema.name)
    private deliveryModel: Model<DeliverySchema>,
  ) {
    super();
  }

  async create(delivery: Delivery): Promise<Delivery> {
    const deliveryData = delivery.toValue();
    const createdDelivery = await this.deliveryModel.create({
      orderId: deliveryData.orderId,
      address: deliveryData.address,
      provider: deliveryData.provider,
      trackingNumber: deliveryData.trackingNumber,
      labelUrl: deliveryData.labelUrl,
      statuses: deliveryData.statuses.map((status) => ({
        status: status.status,
        description: status.description,
      })),
    });
    return this.mapSchemaToEntity(createdDelivery);
  }

  async addStatus(
    deliveryId: string,
    status: PrimitiveDeliveryStatus,
  ): Promise<Delivery> {
    const updatedDelivery = await this.deliveryModel.findByIdAndUpdate(
      deliveryId,
      {
        $push: {
          statuses: {
            status: status.status,
            description: status.description,
          },
        },
      },
      { new: true },
    );

    if (!updatedDelivery) {
      throw new Error('Error updating delivery');
    }

    return this.mapSchemaToEntity(updatedDelivery);
  }

  async findAll(): Promise<Delivery[]> {
    const deliveryDocuments = await this.deliveryModel.find().exec();
    return deliveryDocuments.map((doc) => this.mapSchemaToEntity(doc));
  }

  async findById(id: string): Promise<Delivery | null> {
    const delivery = await this.deliveryModel.findById(id).exec();
    if (!delivery) return null;
    return this.mapSchemaToEntity(delivery);
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Delivery | null> {
    const delivery = await this.deliveryModel
      .findOne({ trackingNumber })
      .exec();
    if (!delivery) return null;
    return this.mapSchemaToEntity(delivery);
  }

  private mapSchemaToEntity(doc: DeliverySchema): Delivery {
    return new Delivery({
      id: doc._id,
      orderId: doc.orderId,
      address: doc.address,
      provider: doc.provider as ShippingProvider,
      trackingNumber: doc.trackingNumber,
      labelUrl: doc.labelUrl,
      statuses: doc.statuses,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
