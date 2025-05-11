/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ShippingProvider } from 'src/deliveries/domain/delivery.entity';
import { HandleProviderStatusUpdateUseCase } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import { ProviderDto } from 'src/providers/infrastructure/webhooks/provider.dto';
import { WebhookController } from 'src/providers/infrastructure/webhooks/webhook.controller';

describe('WebhookController', () => {
  let controller: WebhookController;
  let handleProviderStatusUpdateUseCase: HandleProviderStatusUpdateUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: HandleProviderStatusUpdateUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    handleProviderStatusUpdateUseCase =
      module.get<HandleProviderStatusUpdateUseCase>(
        HandleProviderStatusUpdateUseCase,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleWebhook', () => {
    it('should process status update and return success response', async () => {
      const providerDto: ProviderDto = {
        provider: ShippingProvider.TLS.toString(),
        trackingNumber: 'tracking-123',
        status: 'DELIVERED',
        description: 'Package has been delivered',
      };

      jest
        .spyOn(handleProviderStatusUpdateUseCase, 'execute')
        .mockResolvedValue(undefined);

      const result = await controller.handleWebhook(providerDto);

      expect(handleProviderStatusUpdateUseCase.execute).toHaveBeenCalledWith({
        trackingNumber: 'tracking-123',
        status: 'DELIVERED',
        description: 'Package has been delivered',
      });
      expect(result).toEqual({
        success: true,
      });
    });

    it('should throw BadRequestException when payload is invalid', async () => {
      const invalidPayload: ProviderDto = {
        provider: 'INVALID_PROVIDER',
        trackingNumber: 'tracking-123',
        status: 'DELIVERED',
        description: 'Package has been delivered',
      };

      await expect(controller.handleWebhook(invalidPayload)).rejects.toThrow(
        'Invalid payload',
      );
    });
  });
});
