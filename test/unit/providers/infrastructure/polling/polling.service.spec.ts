/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderStatusUpdateDto } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update.dto';
import { HandleProviderStatusUpdateUseCase } from 'src/providers/application/handle-provider-status-update-use-case/handle-provider-status-update-use-case';
import * as mappers from 'src/providers/infrastructure/mappers';
import { PollingService } from 'src/providers/infrastructure/polling/polling.service';
import * as utils from 'src/providers/infrastructure/utils';

describe('PollingService', () => {
  let service: PollingService;
  let handleProviderStatusUpdateUseCase: HandleProviderStatusUpdateUseCase;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollingService,
        {
          provide: HandleProviderStatusUpdateUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PollingService>(PollingService);
    handleProviderStatusUpdateUseCase =
      module.get<HandleProviderStatusUpdateUseCase>(
        HandleProviderStatusUpdateUseCase,
      );
    configService = module.get<ConfigService>(ConfigService);

    // Mock Logger to prevent console output in tests
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('pollProviderUpdates', () => {
    const mockProviderDto = {
      provider: 'TLS',
      trackingNumber: 'TRK-123456',
      status: 'IN_TRANSIT',
      description: 'Package is in transit',
    };

    const mockStatusUpdateDto: ProviderStatusUpdateDto = {
      trackingNumber: 'TRK-123456',
      status: 'IN_TRANSIT',
      description: 'Package is in transit',
    };

    it('should fetch updates and process them successfully', async () => {
      // Mock the internal methods
      jest
        .spyOn(service as any, 'fetchProviderUpdates')
        .mockResolvedValue(mockProviderDto);
      jest
        .spyOn(mappers, 'mapPayloadToDto')
        .mockReturnValue(mockStatusUpdateDto);
      jest
        .spyOn(handleProviderStatusUpdateUseCase, 'execute')
        .mockResolvedValue(undefined);

      await service.pollProviderUpdates();

      expect(service['fetchProviderUpdates']).toHaveBeenCalled();
      expect(mappers.mapPayloadToDto).toHaveBeenCalledWith(mockProviderDto);
      expect(handleProviderStatusUpdateUseCase.execute).toHaveBeenCalledWith(
        mockStatusUpdateDto,
      );
    });

    it('should return early if no provider updates', async () => {
      jest
        .spyOn(service as any, 'fetchProviderUpdates')
        .mockResolvedValue(null);
      jest.spyOn(mappers, 'mapPayloadToDto');

      await service.pollProviderUpdates();

      expect(service['fetchProviderUpdates']).toHaveBeenCalled();
      expect(mappers.mapPayloadToDto).not.toHaveBeenCalled();
      expect(handleProviderStatusUpdateUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return early if mapping fails', async () => {
      jest
        .spyOn(service as any, 'fetchProviderUpdates')
        .mockResolvedValue(mockProviderDto);
      jest.spyOn(mappers, 'mapPayloadToDto').mockReturnValue(undefined);

      await service.pollProviderUpdates();

      expect(service['fetchProviderUpdates']).toHaveBeenCalled();
      expect(mappers.mapPayloadToDto).toHaveBeenCalledWith(mockProviderDto);
      expect(handleProviderStatusUpdateUseCase.execute).not.toHaveBeenCalled();
    });

    it('should handle errors when executing use case', async () => {
      jest
        .spyOn(service as any, 'fetchProviderUpdates')
        .mockResolvedValue(mockProviderDto);
      jest
        .spyOn(mappers, 'mapPayloadToDto')
        .mockReturnValue(mockStatusUpdateDto);
      jest
        .spyOn(handleProviderStatusUpdateUseCase, 'execute')
        .mockRejectedValue(new Error('Test error'));

      await service.pollProviderUpdates();

      expect(service['fetchProviderUpdates']).toHaveBeenCalled();
      expect(mappers.mapPayloadToDto).toHaveBeenCalledWith(mockProviderDto);
      expect(handleProviderStatusUpdateUseCase.execute).toHaveBeenCalledWith(
        mockStatusUpdateDto,
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });

  describe('fetchProviderUpdates', () => {
    it('should fetch provider updates with tracking number from config', async () => {
      const trackingNumber = 'TRK-123456';
      const mockProviderUpdate = {
        provider: 'TLS',
        trackingNumber,
        status: 'IN_TRANSIT',
        description: 'Package is in transit',
      };

      jest.spyOn(configService, 'get').mockReturnValue(trackingNumber);
      jest
        .spyOn(utils, 'generateRandomProviderUpdate')
        .mockReturnValue(mockProviderUpdate);
      jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
        cb();
        return {} as any;
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const result = await (service as any).fetchProviderUpdates();

      expect(configService.get).toHaveBeenCalledWith('polling.trackingNumber');
      expect(utils.generateRandomProviderUpdate).toHaveBeenCalledWith(
        trackingNumber,
      );
      expect(result).toEqual(mockProviderUpdate);
    });
  });
});
