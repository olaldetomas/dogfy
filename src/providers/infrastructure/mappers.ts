import { ShippingProvider } from 'src/deliveries/domain/delivery.entity';
import { ProviderStatusUpdateDto } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update.dto';

import { ProviderDto } from './webhooks/provider.dto';

export function mapPayloadToDto(
  payload: ProviderDto,
): ProviderStatusUpdateDto | undefined {
  if (payload.provider === ShippingProvider.TLS.toString()) {
    return {
      trackingNumber: payload.trackingNumber,
      status: payload.status,
      description: payload.description,
    };
  }

  if (payload.provider === ShippingProvider.NRW.toString()) {
    return {
      trackingNumber: payload.trackingNumber,
      status: payload.status,
      description: payload.description,
    };
  }

  return undefined;
}
