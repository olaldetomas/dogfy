import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { HandleProviderStatusUpdateUseCase } from '../deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import { DeliveryModule } from '../deliveries/infrastructure/delivery.module';
import { PollingService } from './polling/polling.service';
import { WebhookController } from './webhooks/webhook.controller';

@Module({
  imports: [ScheduleModule.forRoot(), DeliveryModule, ConfigModule],
  controllers: [WebhookController],
  providers: [HandleProviderStatusUpdateUseCase, PollingService],
  exports: [HandleProviderStatusUpdateUseCase, PollingService],
})
export class ProvidersModule {}
