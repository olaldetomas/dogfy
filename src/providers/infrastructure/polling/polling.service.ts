import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HandleProviderStatusUpdateUseCase } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';

import { mapPayloadToDto } from '../mappers';
import { generateRandomProviderUpdate } from '../utils';
import { ProviderDto } from '../webhooks/provider.dto';

@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);

  constructor(
    private readonly handleProviderStatusUpdateUseCase: HandleProviderStatusUpdateUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async pollProviderUpdates(): Promise<void> {
    const providerUpdates = await this.fetchProviderUpdates();
    this.logger.debug(`Provider updates: ${JSON.stringify(providerUpdates)}`);
    if (!providerUpdates) return;

    const dto = mapPayloadToDto(providerUpdates);
    if (!dto) return;

    try {
      await this.handleProviderStatusUpdateUseCase.execute(dto);
      this.logger.debug(
        `Successfully processed update for tracking number: ${dto.trackingNumber}`,
      );
    } catch {
      this.logger.error(
        `Failed to process provider update for tracking number: ${dto.trackingNumber}`,
      );
    }
  }

  private async fetchProviderUpdates(): Promise<ProviderDto> {
    this.logger.debug('Fetching mock provider updates...');

    await new Promise((resolve) => setTimeout(resolve, 500));

    return generateRandomProviderUpdate(
      this.configService.get<string>('polling.trackingNumber') as string,
    );
  }
}
