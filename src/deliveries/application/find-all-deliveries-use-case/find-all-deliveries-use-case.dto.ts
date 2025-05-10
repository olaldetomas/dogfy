export class FindAllDeliveriesUseCaseDto {
  orderId: string;
  address: string;
  provider: string;
  trackingNumber: string;
  labelUrl: string;
  statuses: {
    status: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
