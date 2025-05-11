import {
  DeliveryStatus,
  DeliveryStatusEnum,
} from '../../../../src/deliveries/domain/delivery-status.entity';
import { generateMockDeliveredStatus } from '../../../__mocks__';

describe('DeliveryStatus Entity', () => {
  describe('createPending', () => {
    it('should create a pending status', () => {
      // Act
      const status = DeliveryStatus.createPending();
      const value = status.toValue();

      // Assert
      expect(value.status).toBe(DeliveryStatusEnum.PENDING);
      expect(value.description).toBe('Delivery is pending processing');
    });
  });

  describe('create', () => {
    it('should create a status with provided values', () => {
      // Arrange
      const statusData = {
        status: DeliveryStatusEnum.IN_TRANSIT,
        description: 'Package is in transit',
      };

      // Act
      const status = DeliveryStatus.create(statusData);
      const value = status.toValue();

      // Assert
      expect(value.status).toBe(DeliveryStatusEnum.IN_TRANSIT);
      expect(value.description).toBe('Package is in transit');
    });
  });

  describe('toValue', () => {
    it('should return the primitive status object', () => {
      // Arrange
      const mockStatus = generateMockDeliveredStatus();
      const status = new DeliveryStatus(mockStatus);

      // Act
      const value = status.toValue();

      // Assert
      expect(value).toEqual(mockStatus);
    });
  });
});
