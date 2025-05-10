import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryHttpDto {
  @ApiProperty({
    description: 'The ID of the order',
    example: 'order123',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'The delivery address',
    example: '123 Main St, New York, NY 10001',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
