import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDeliveryUseCase } from 'src/deliveries/application/create-delivery-use-case/create-delivery-use-case';
import { PrimitiveDelivery } from 'src/deliveries/domain/delivery.entity';

import { CreateDeliveryDto } from './create-delivery.http-dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class CreateDeliveryController {
  constructor(private readonly createDeliveryUseCase: CreateDeliveryUseCase) {}

  @ApiOperation({ summary: 'Create a new delivery' })
  @ApiBody({
    type: CreateDeliveryDto,
    examples: {
      delivery: {
        summary: 'Create a delivery example',
        description: 'A sample delivery request',
        value: {
          orderId: 'order123',
          address: '123 Main St, New York, NY 10001',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'The delivery has been successfully created with a shipping label.',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  async run(
    @Body() createDeliveryHttpDto: CreateDeliveryDto,
  ): Promise<PrimitiveDelivery> {
    return await this.createDeliveryUseCase.execute({
      orderId: createDeliveryHttpDto.orderId,
      address: createDeliveryHttpDto.address,
    });
  }
}
