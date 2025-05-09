import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CreateDeliveryUseCase } from '../application/create-delivery-use-case/create-delivery-use-case';
import { FindAllDeliveriesUseCase } from '../application/find-all-deliveries-use-case/find-all-deliveries-use-case';
import { DeliveryRepository } from '../domain/delivery.repository';
import { CreateDeliveryController } from './http/v1/create-delivery/create-delivery.controller';
import { FindAllDeliveriesController } from './http/v1/find-all-deliveries/find-all-deliveries.controller';
import { MongoDeliveryRepository } from './repositories/delivery.repository';
import {
  DeliverySchema,
  DeliverySchemaObject,
} from './schemas/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliverySchema.name, schema: DeliverySchemaObject },
    ]),
  ],
  controllers: [CreateDeliveryController, FindAllDeliveriesController],
  providers: [
    CreateDeliveryUseCase,
    FindAllDeliveriesUseCase,
    MongoDeliveryRepository,
    {
      provide: DeliveryRepository,
      useExisting: MongoDeliveryRepository,
    },
  ],
  exports: [CreateDeliveryUseCase, FindAllDeliveriesUseCase],
})
export class DeliveryModule {}
