import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeliveryStatusDocument = HydratedDocument<DeliveryStatusSchema>;

@Schema({ timestamps: true })
export class DeliveryStatusSchema {
  _id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DeliveryStatusSchemaObject =
  SchemaFactory.createForClass(DeliveryStatusSchema);
