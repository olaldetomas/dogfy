import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { HandleProviderStatusUpdateUseCase } from '../../deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import { mapPayloadToDto } from './mappers';
import { ProviderDto } from './provider.dto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(
    private readonly handleProviderStatusUpdateUseCase: HandleProviderStatusUpdateUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Handle delivery status update from provider' })
  @ApiBody({ type: ProviderDto })
  @ApiResponse({
    status: 200,
    description: 'Delivery status update processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  async handleWebhook(@Body() payload: ProviderDto) {
    const dto = mapPayloadToDto(payload);

    if (!dto) {
      throw new BadRequestException('Invalid payload');
    }

    await this.handleProviderStatusUpdateUseCase.execute(dto);
    return { success: true };
  }
}
