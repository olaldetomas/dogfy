import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';

export class ProviderDto {
  @ApiProperty({
    description: 'Provider name',
    example: 'TLS',
  })
  provider: string;

  @ApiProperty({
    description: 'Tracking number of the delivery',
    example: 'TRK-123456',
  })
  trackingNumber: string;

  @ApiProperty({
    description: 'Status of the delivery',
    enum: DeliveryStatusEnum,
    example: 'IN_TRANSIT',
  })
  status: string;

  @ApiProperty({
    description: 'Additional information about the delivery status',
    required: false,
    example: 'Package is in transit',
  })
  description: string;
}
