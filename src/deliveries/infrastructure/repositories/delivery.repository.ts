import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Delivery, ShippingProvider } from '../../domain/delivery.entity';
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

  async create(delivery: Delivery): Promise<Delivery> {
    const deliveryData = delivery.toValue();
    const createdDelivery = await this.deliveryModel.create({
      ...deliveryData,
      statuses: deliveryData.statuses.map((status) => ({
        id: status.id,
        status: status.status,
        description: status.description,
        createdAt: status.createdAt,
        updatedAt: status.updatedAt,
      })),
    });
    return this.mapSchemaToEntity(createdDelivery);
  }

  async update(delivery: Delivery): Promise<Delivery> {
    const deliveryData = delivery.toValue();
    const originalDelivery = await this.deliveryModel.findOne({
      id: deliveryData.id,
    });
    if (!originalDelivery) {
      throw new Error('Delivery not found');
    }

    const existingStatusesCount = originalDelivery.statuses?.length || 0;
    const newStatuses = deliveryData.statuses.slice(existingStatusesCount);

    const updatedDelivery = await this.deliveryModel.findOneAndUpdate(
      { id: deliveryData.id },
      {
        $set: {
          trackingNumber: deliveryData.trackingNumber,
          labelUrl: deliveryData.labelUrl,
          updatedAt: deliveryData.updatedAt,
        },
        $push: {
          statuses: {
            $each: newStatuses.map((status) => ({
              id: status.id,
              status: status.status,
              description: status.description,
              createdAt: status.createdAt,
              updatedAt: status.updatedAt,
            })),
          },
        },
      },
      { new: true },
    );

    if (!updatedDelivery) {
      throw new Error('Delivery not found');
    }

    return this.mapSchemaToEntity(updatedDelivery);
  }

  async findAll(): Promise<Delivery[]> {
    const deliveryDocuments = await this.deliveryModel.find().exec();
    return deliveryDocuments.map((doc) => this.mapSchemaToEntity(doc));
  }

  async findById(id: string): Promise<Delivery | null> {
    const delivery = await this.deliveryModel.findOne({ id }).exec();
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
      id: doc.id,
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
