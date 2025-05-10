import { Module } from '@nestjs/common';

import { HandleProviderStatusUpdateUseCase } from '../deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import { DeliveryModule } from '../deliveries/infrastructure/delivery.module';
import { WebhookController } from './webhooks/webhook.controller';

@Module({
  imports: [DeliveryModule],
  controllers: [WebhookController],
  providers: [HandleProviderStatusUpdateUseCase],
  exports: [HandleProviderStatusUpdateUseCase],
})
export class ProvidersModule {}
