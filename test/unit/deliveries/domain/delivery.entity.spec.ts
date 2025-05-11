import {
  Delivery,
  ShippingProvider,
} from '../../../../src/deliveries/domain/delivery.entity';
import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../../../src/deliveries/domain/delivery-status.entity';
import { generateMockDelivery } from '../../../__mocks__';

describe('Delivery Entity', () => {
  describe('create', () => {
    it('should create a delivery with the provided data', () => {
      // Arrange
      const createDeliveryData = {
        orderId: 'order123',
        address: '123 Main St',
        statuses: [DeliveryStatus.createPending()],
      };

      // Mock the random provider selection to make the test deterministic
      jest
        .spyOn(Delivery, 'selectRandomProvider')
        .mockReturnValue(ShippingProvider.NRW);

      // Act
      const delivery = Delivery.create(createDeliveryData);
      const deliveryValue = delivery.toValue();

      // Assert
      expect(deliveryValue.orderId).toBe(createDeliveryData.orderId);
      expect(deliveryValue.address).toBe(createDeliveryData.address);
      expect(deliveryValue.provider).toBe(ShippingProvider.NRW);
      expect(deliveryValue.statuses).toHaveLength(1);
      expect(deliveryValue.statuses[0].status).toBe(DeliveryStatusEnum.PENDING);
      expect(deliveryValue.statuses[0].description).toBe(
        'Delivery is pending processing',
      );
    });
  });

  describe('selectRandomProvider', () => {
    it('should return a valid provider', () => {
      // Act
      const provider = Delivery.selectRandomProvider();

      // Assert
      expect(Object.values(ShippingProvider)).toContain(provider);
    });
  });

  describe('setLabelInfo', () => {
    it('should set tracking number and label URL', () => {
      // Arrange
      const mockDelivery = generateMockDelivery();
      const trackingNumber = 'TRK123456';
      const labelUrl = 'https://example.com/label.pdf';

      // Act
      mockDelivery.setLabelInfo(trackingNumber, labelUrl);
      const deliveryValue = mockDelivery.toValue();

      // Assert
      expect(deliveryValue.trackingNumber).toBe(trackingNumber);
      expect(deliveryValue.labelUrl).toBe(labelUrl);
    });
  });

  describe('toValue', () => {
    it('should return the primitive delivery object', () => {
      // Arrange
      jest
        .spyOn(Delivery, 'selectRandomProvider')
        .mockReturnValue(ShippingProvider.TLS);

      const mockDelivery = generateMockDelivery({
        provider: ShippingProvider.TLS,
      });

      // Act
      const value = mockDelivery.toValue();

      // Assert
      expect(value).toEqual(
        expect.objectContaining({
          orderId: 'order123',
          address: '123 Main St',
          provider: ShippingProvider.TLS,
          statuses: [
            expect.objectContaining({
              status: DeliveryStatusEnum.PENDING,
              description: 'Delivery is pending processing',
            }),
          ],
        }),
      );
    });
  });
});
