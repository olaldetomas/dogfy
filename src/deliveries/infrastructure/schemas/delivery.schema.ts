import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ShippingProvider } from '../../domain/delivery.entity';
import {
  DeliveryStatusSchema,
  DeliveryStatusSchemaObject,
} from './delivery-status.schema';

@Schema({ timestamps: true })
export class DeliverySchema {
  _id: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: ShippingProvider })
  provider: string;

  @Prop()
  trackingNumber: string;

  @Prop()
  labelUrl: string;

  @Prop({ type: [DeliveryStatusSchemaObject] })
  statuses: DeliveryStatusSchema[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DeliverySchemaObject =
  SchemaFactory.createForClass(DeliverySchema);
