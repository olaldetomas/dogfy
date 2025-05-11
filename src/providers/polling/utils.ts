import { ProviderStatusUpdateDto } from 'src/deliveries/application/handle-provider-status-update-use-case/handle-provider-status-update.dto';

function getRandomStatus(): string {
  const statuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
}

function getRandomDescription(): string {
  switch (getRandomStatus()) {
    case 'PENDING':
      return 'Package is pending processing';
    case 'IN_TRANSIT':
      return 'Package is in transit';
    case 'DELIVERED':
      return 'Package has been delivered';
    case 'CANCELLED':
      return 'Delivery was cancelled';
    default:
      return 'Unknown status';
  }
}

export function generateRandomProviderUpdate(
  trackingNumber: string,
): ProviderStatusUpdateDto {
  return {
    trackingNumber,
    status: getRandomStatus(),
    description: getRandomDescription(),
  };
}
