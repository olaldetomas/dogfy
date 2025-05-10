import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeliveryStatusDocument = HydratedDocument<DeliveryStatusSchema>;

@Schema({ timestamps: true })
export class DeliveryStatusSchema {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const DeliveryStatusSchemaObject =
  SchemaFactory.createForClass(DeliveryStatusSchema);
