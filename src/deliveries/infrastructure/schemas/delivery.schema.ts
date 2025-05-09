import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

import { ShippingProvider } from '../../domain/delivery.entity';

export type DeliveryDocument = HydratedDocument<DeliverySchema>;

@Schema({ timestamps: true })
export class DeliverySchema {
  @ApiProperty({
    description: 'The unique identifier of the delivery',
    example: 'c120b539-5a9b-4b5c-9012-a59bc10c3234',
  })
  @Prop()
  id: string;

  @ApiProperty({ description: 'The ID of the order', example: 'order123' })
  @Prop({ required: true })
  orderId: string;

  @ApiProperty({
    description: 'The delivery address',
    example: '123 Main St, New York, NY 10001',
  })
  @Prop({ required: true })
  address: string;

  @ApiProperty({
    description: 'The shipping provider',
    example: 'NRW',
    enum: ShippingProvider,
  })
  @Prop({ required: true, enum: ShippingProvider })
  provider: string;

  @ApiProperty({ description: 'The tracking number', example: 'TRK-123456' })
  @Prop()
  trackingNumber: string;

  @ApiProperty({
    description: 'The URL to the shipping label',
    example: 'https://shipping-labels.example.com/NRW/label-TRK-123456.pdf',
  })
  @Prop()
  labelUrl: string;

  @ApiProperty({ description: 'The creation date of the delivery' })
  @Prop()
  createdAt: Date;
}

export const DeliverySchemaObject =
  SchemaFactory.createForClass(DeliverySchema);
