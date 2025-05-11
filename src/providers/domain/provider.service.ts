import { Delivery } from 'src/deliveries/domain/delivery.entity';

import { GenerateLabelDto } from './generate-label.dto';

export abstract class ProviderService {
  abstract generateLabel(delivery: Delivery): Promise<GenerateLabelDto>;
}
