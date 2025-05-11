import { ShippingProvider } from 'src/deliveries/domain/delivery.entity';
import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';
import { mapPayloadToDto } from 'src/providers/infrastructure/mappers';
import { ProviderDto } from 'src/providers/infrastructure/webhooks/provider.dto';

describe('Mappers', () => {
  describe('mapPayloadToDto', () => {
    it('should map TLS provider payload to dto', () => {
      const payload: ProviderDto = {
        provider: ShippingProvider.TLS.toString(),
        trackingNumber: 'TRK-123456',
        status: DeliveryStatusEnum.IN_TRANSIT.toString(),
        description: 'Package is in transit',
      };

      const result = mapPayloadToDto(payload);

      expect(result).toEqual({
        trackingNumber: 'TRK-123456',
        status: DeliveryStatusEnum.IN_TRANSIT.toString(),
        description: 'Package is in transit',
      });
    });

    it('should map NRW provider payload to dto', () => {
      const payload: ProviderDto = {
        provider: ShippingProvider.NRW.toString(),
        trackingNumber: 'NRW-789012',
        status: DeliveryStatusEnum.DELIVERED.toString(),
        description: 'Package has been delivered',
      };

      const result = mapPayloadToDto(payload);

      expect(result).toEqual({
        trackingNumber: 'NRW-789012',
        status: DeliveryStatusEnum.DELIVERED.toString(),
        description: 'Package has been delivered',
      });
    });

    it('should return undefined for invalid provider', () => {
      const payload: ProviderDto = {
        provider: 'INVALID_PROVIDER',
        trackingNumber: 'INV-123456',
        status: DeliveryStatusEnum.PENDING.toString(),
        description: 'Pending shipment',
      };

      const result = mapPayloadToDto(payload);

      expect(result).toBeUndefined();
    });
  });
});
