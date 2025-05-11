import { Injectable } from '@nestjs/common';
import {
  Delivery,
  ShippingProvider,
} from 'src/deliveries/domain/delivery.entity';
import { GenerateLabelDto } from 'src/providers/domain/generate-label.dto';
import { ProviderService } from 'src/providers/domain/provider.service';

import { fetchProvidedInfo } from '../utils';

@Injectable()
export class ProviderServiceImplementation implements ProviderService {
  constructor() {}
  async generateLabel(delivery: Delivery): Promise<GenerateLabelDto> {
    switch (delivery.toValue().provider) {
      case ShippingProvider.TLS:
        return await fetchProvidedInfo(delivery.toValue().provider);
      case ShippingProvider.NRW:
        return await fetchProvidedInfo(delivery.toValue().provider);
      default:
        throw new Error('Provider not supported');
    }
  }
}
