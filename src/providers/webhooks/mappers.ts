import { ProviderStatusUpdateDto } from 'src/deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update.dto';

import { ProviderDto } from './provider.dto';

export function mapPayloadToDto(
  payload: ProviderDto,
): ProviderStatusUpdateDto | undefined {
  if (payload.provider === 'TLS') {
    return {
      trackingNumber: payload.trackingNumber,
      status: payload.status,
      description: payload.description,
    };
  }

  return undefined;
}
