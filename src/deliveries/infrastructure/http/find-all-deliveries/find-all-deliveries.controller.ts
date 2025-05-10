import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllDeliveriesUseCase } from 'src/deliveries/application/find-all-deliveries-use-case/find-all-deliveries-use-case';
import { FindAllDeliveriesUseCaseDto } from 'src/deliveries/application/find-all-deliveries-use-case/find-all-deliveries-use-case.dto';

@ApiTags('deliveries')
@Controller('deliveries')
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
  async run(): Promise<FindAllDeliveriesUseCaseDto[]> {
    return await this.findAllDeliveriesUseCase.run();
  }
}
