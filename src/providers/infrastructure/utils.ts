import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';

import { ProviderDto } from './webhooks/provider.dto';

function getRandomStatus(): {
  status: DeliveryStatusEnum;
  description: string;
} {
  const statuses = [
    {
      status: DeliveryStatusEnum.PENDING,
      description: 'Package is pending processing',
    },
    {
      status: DeliveryStatusEnum.IN_TRANSIT,
      description: 'Package is in transit',
    },
    {
      status: DeliveryStatusEnum.DELIVERED,
      description: 'Package has been delivered',
    },
    {
      status: DeliveryStatusEnum.CANCELLED,
      description: 'Delivery was cancelled',
    },
    {
      status: DeliveryStatusEnum.RETURNED,
      description: 'Package was returned',
    },
  ];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
}

export function generateRandomProviderUpdate(
  trackingNumber: string,
): ProviderDto {
  const randomStatus = getRandomStatus();
  return {
    provider: 'TLS',
    trackingNumber,
    ...randomStatus,
  };
}

export async function fetchProvidedInfo(provider: string): Promise<{
  trackingNumber: string;
  labelUrl: string;
}> {
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  const randomTrackingNumber = `${provider}-${randomSixDigitNumber}`;
  const randomLabelUrl = `https://shipping-labels.example.com/label-${randomTrackingNumber}.pdf`;
  return await new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          trackingNumber: randomTrackingNumber,
          labelUrl: randomLabelUrl,
        }),
      1000,
    ),
  );
}
