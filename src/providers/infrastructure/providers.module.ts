import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DeliveryModule } from '../../deliveries/infrastructure/delivery.module';
import { HandleProviderStatusUpdateUseCase } from '../application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import { ProviderService } from '../domain/provider.service';
import { PollingService } from './polling/polling.service';
import { ProviderServiceImplementation } from './services/provider.service';
import { WebhookController } from './webhooks/webhook.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => DeliveryModule),
    ConfigModule,
  ],
  controllers: [WebhookController],
  providers: [
    HandleProviderStatusUpdateUseCase,
    PollingService,
    ProviderServiceImplementation,
    {
      provide: ProviderService,
      useExisting: ProviderServiceImplementation,
    },
  ],
  exports: [HandleProviderStatusUpdateUseCase, PollingService, ProviderService],
})
export class ProvidersModule {}
