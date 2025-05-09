import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllDeliveriesUseCase } from 'src/deliveries/application/find-all-deliveries-use-case/find-all-deliveries-use-case';
import { PrimitiveDelivery } from 'src/deliveries/domain/delivery.entity';
import { V1_DELIVERIES } from 'src/deliveries/infrastructure/route.constants';

@ApiTags('deliveries')
@Controller(V1_DELIVERIES)
export class FindAllDeliveriesController {
  constructor(
    private readonly findAllDeliveriesUseCase: FindAllDeliveriesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all deliveries',
    type: Object,
  })
  async run(): Promise<{ deliveries: PrimitiveDelivery[] }> {
    return await this.findAllDeliveriesUseCase.run();
  }
}
