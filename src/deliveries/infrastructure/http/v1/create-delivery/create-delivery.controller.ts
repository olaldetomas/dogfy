import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDeliveryUseCase } from 'src/deliveries/application/create-delivery-use-case/create-delivery-use-case';
import { PrimitiveDelivery } from 'src/deliveries/domain/delivery.entity';
import { V1_DELIVERIES } from 'src/deliveries/infrastructure/route.constants';

import { CreateDeliveryHttpDto } from './create-delivery.http-dto';

@ApiTags('deliveries')
@Controller(V1_DELIVERIES)
export class CreateDeliveryController {
  constructor(private readonly createDeliveryUseCase: CreateDeliveryUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery' })
  @ApiBody({
    type: CreateDeliveryHttpDto,
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
  async run(
    @Body() createDeliveryHttpDto: CreateDeliveryHttpDto,
  ): Promise<{ delivery: PrimitiveDelivery }> {
    return await this.createDeliveryUseCase.run({
      orderId: createDeliveryHttpDto.orderId,
      address: createDeliveryHttpDto.address,
    });
  }
}
