import { DeliveryStatusEnum } from 'src/deliveries/domain/delivery-status.entity';
import {
  fetchProvidedInfo,
  generateRandomProviderUpdate,
} from 'src/providers/infrastructure/utils';

describe('Utils', () => {
  let originalDateNow: () => number;
  let originalMathRandom: () => number;

  beforeEach(() => {
    // Save original implementations
    originalDateNow = Date.now;
    originalMathRandom = Math.random;

    // Mock timers and random functions for consistent tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore original implementations
    Date.now = originalDateNow;
    Math.random = originalMathRandom;
    jest.useRealTimers();
  });

  describe('generateRandomProviderUpdate', () => {
    it('should generate a provider update with the provided tracking number', () => {
      // Mock Math.random to return a consistent value
      // This will give index 1 (IN_TRANSIT) for the status array
      Math.random = jest.fn().mockReturnValue(0.2);

      const trackingNumber = 'TEST-123456';
      const result = generateRandomProviderUpdate(trackingNumber);

      expect(result).toEqual({
        provider: 'TLS',
        trackingNumber: 'TEST-123456',
        status: DeliveryStatusEnum.IN_TRANSIT,
        description: 'Package is in transit',
      });
    });

    it('should return different statuses based on random values', () => {
      // Test status mapping more precisely
      // The indices in the status array map to:
      // 0 -> PENDING, 1 -> IN_TRANSIT, 2 -> DELIVERED, 3 -> CANCELLED, 4 -> RETURNED
      const trackingNumber = 'TEST-123456';

      // Math.floor(0 * 5) = 0 -> PENDING
      Math.random = jest.fn().mockReturnValue(0);
      const result1 = generateRandomProviderUpdate(trackingNumber);
      expect(result1.status).toBe(DeliveryStatusEnum.PENDING);

      // Math.floor(0.2 * 5) = 1 -> IN_TRANSIT
      Math.random = jest.fn().mockReturnValue(0.2);
      const result2 = generateRandomProviderUpdate(trackingNumber);
      expect(result2.status).toBe(DeliveryStatusEnum.IN_TRANSIT);

      // Math.floor(0.4 * 5) = 2 -> DELIVERED
      Math.random = jest.fn().mockReturnValue(0.4);
      const result3 = generateRandomProviderUpdate(trackingNumber);
      expect(result3.status).toBe(DeliveryStatusEnum.DELIVERED);

      // Math.floor(0.6 * 5) = 3 -> CANCELLED
      Math.random = jest.fn().mockReturnValue(0.6);
      const result4 = generateRandomProviderUpdate(trackingNumber);
      expect(result4.status).toBe(DeliveryStatusEnum.CANCELLED);

      // Math.floor(0.8 * 5) = 4 -> RETURNED
      Math.random = jest.fn().mockReturnValue(0.8);
      const result5 = generateRandomProviderUpdate(trackingNumber);
      expect(result5.status).toBe(DeliveryStatusEnum.RETURNED);
    });
  });

  describe('fetchProvidedInfo', () => {
    it('should return tracking number and label URL for provider', async () => {
      // Mock Math.random for consistent results
      Math.random = jest.fn().mockReturnValue(0.5);

      // Skip the setTimeout wait
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 0 as unknown as NodeJS.Timeout;
      });

      const result = await fetchProvidedInfo('TEST');

      expect(result).toEqual({
        trackingNumber: 'TEST-550000',
        labelUrl: 'https://shipping-labels.example.com/label-TEST-550000.pdf',
      });
    });

    it('should generate different tracking numbers for different providers', async () => {
      // Mock Math.random for consistent results
      Math.random = jest.fn().mockReturnValue(0.5);

      // Skip the setTimeout wait
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 0 as unknown as NodeJS.Timeout;
      });

      const result1 = await fetchProvidedInfo('TLS');
      const result2 = await fetchProvidedInfo('NRW');

      expect(result1.trackingNumber).toBe('TLS-550000');
      expect(result2.trackingNumber).toBe('NRW-550000');
      expect(result1.trackingNumber).not.toBe(result2.trackingNumber);
    });
  });
});
