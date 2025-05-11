import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetLatestStatusByIdUseCaseDto } from 'src/deliveries/application/get-latest-status-by-id-use-case/get-latest-status-by-id-use-case.dto';

import { GetLatestStatusByIdUseCase } from '../../../application/get-latest-status-by-id-use-case/get-latest-status-by-id-use-case';

@ApiTags('deliveries')
@Controller('deliveries')
export class GetLatestStatusByIdController {
  constructor(
    private readonly getLatestStatusByIdUseCase: GetLatestStatusByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Get latest delivery status by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the delivery',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the latest status of the delivery',
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found or no status available',
  })
  @Get(':id/status')
  async getLatestStatusById(
    @Param('id') id: string,
  ): Promise<GetLatestStatusByIdUseCaseDto> {
    return this.getLatestStatusByIdUseCase.execute(id);
  }
}
