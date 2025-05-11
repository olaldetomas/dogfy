import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ProviderStatusUpdateDto } from '../../deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update.dto';
import { HandleProviderStatusUpdateUseCase } from '../../deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import { generateRandomProviderUpdate } from './utils';

interface ProviderStatusUpdate {
  trackingNumber: string;
  status: string;
  description: string;
}

@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);

  constructor(
    private readonly handleProviderStatusUpdateUseCase: HandleProviderStatusUpdateUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async pollProviderUpdates(): Promise<void> {
    this.logger.debug('Polling for provider updates...');

    try {
      const providerUpdates = await this.fetchProviderUpdates();
      this.logger.debug(`Provider updates: ${JSON.stringify(providerUpdates)}`);

      if (!providerUpdates) return;

      await this.processProviderUpdate(providerUpdates);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error while polling provider API: ${errorMessage}`);
    }
  }

  private async fetchProviderUpdates(): Promise<ProviderStatusUpdate> {
    this.logger.debug('Fetching mock provider updates...');
    // Delay (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return generateRandomProviderUpdate(
      this.configService.get<string>('polling.trackingNumber') as string,
    );
  }

  private async processProviderUpdate(
    update: ProviderStatusUpdate,
  ): Promise<void> {
    try {
      const statusUpdate: ProviderStatusUpdateDto = {
        trackingNumber: update.trackingNumber,
        status: update.status,
        description: update.description,
      };

      await this.handleProviderStatusUpdateUseCase.execute(statusUpdate);
      this.logger.debug(
        `Successfully processed update for tracking number: ${update.trackingNumber}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error processing update for tracking number: ${update.trackingNumber}: ${errorMessage}`,
      );
    }
  }
}
