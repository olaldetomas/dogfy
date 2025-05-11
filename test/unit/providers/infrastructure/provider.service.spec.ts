import { Test } from '@nestjs/testing';

import {
  Delivery,
  ShippingProvider,
} from '../../../../src/deliveries/domain/delivery.entity';
import { ProviderServiceImplementation } from '../../../../src/providers/infrastructure/services/provider.service';
import * as utils from '../../../../src/providers/infrastructure/utils';

describe('ProviderServiceImplementation', () => {
  let providerService: ProviderServiceImplementation;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ProviderServiceImplementation],
    }).compile();

    providerService = moduleRef.get<ProviderServiceImplementation>(
      ProviderServiceImplementation,
    );
  });

  describe('generateLabel', () => {
    it('should generate a label for TLS provider', async () => {
      // Arrange
      const delivery = new Delivery({
        orderId: 'order123',
        address: '123 Main St',
        provider: ShippingProvider.TLS,
        statuses: [],
      });

      const mockLabelData = {
        trackingNumber: 'TLS-123456',
        labelUrl: 'https://shipping-labels.example.com/label-TLS-123456.pdf',
      };

      jest.spyOn(utils, 'fetchProvidedInfo').mockResolvedValue(mockLabelData);

      // Act
      const result = await providerService.generateLabel(delivery);

      // Assert
      expect(utils.fetchProvidedInfo).toHaveBeenCalledWith(
        ShippingProvider.TLS,
      );
      expect(result).toEqual(mockLabelData);
    });

    it('should generate a label for NRW provider', async () => {
      // Arrange
      const delivery = new Delivery({
        orderId: 'order123',
        address: '123 Main St',
        provider: ShippingProvider.NRW,
        statuses: [],
      });

      const mockLabelData = {
        trackingNumber: 'NRW-654321',
        labelUrl: 'https://shipping-labels.example.com/label-NRW-654321.pdf',
      };

      jest.spyOn(utils, 'fetchProvidedInfo').mockResolvedValue(mockLabelData);

      // Act
      const result = await providerService.generateLabel(delivery);

      // Assert
      expect(utils.fetchProvidedInfo).toHaveBeenCalledWith(
        ShippingProvider.NRW,
      );
      expect(result).toEqual(mockLabelData);
    });

    it('should throw an error for unsupported provider', async () => {
      // Arrange
      const delivery = new Delivery({
        orderId: 'order123',
        address: '123 Main St',
        provider: 'UNSUPPORTED' as ShippingProvider,
        statuses: [],
      });

      // Act & Assert
      await expect(providerService.generateLabel(delivery)).rejects.toThrow(
        'Provider not supported',
      );
    });
  });
});
