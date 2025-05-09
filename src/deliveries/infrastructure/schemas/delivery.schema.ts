import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ShippingProvider } from '../../domain/delivery.entity';

export type DeliveryDocument = HydratedDocument<DeliverySchema>;

@Schema({ timestamps: true })
export class DeliverySchema {
  @Prop()
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

  @Prop()
  createdAt: Date;
}

export const DeliverySchemaObject =
  SchemaFactory.createForClass(DeliverySchema);
