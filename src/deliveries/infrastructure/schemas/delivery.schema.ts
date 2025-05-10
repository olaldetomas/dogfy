import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ShippingProvider } from '../../domain/delivery.entity';
import {
  DeliveryStatusSchema,
  DeliveryStatusSchemaObject,
} from './delivery-status.schema';

@Schema({ timestamps: true })
export class DeliverySchema {
  @Prop({ required: true })
  id: string;

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

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const DeliverySchemaObject =
  SchemaFactory.createForClass(DeliverySchema);
