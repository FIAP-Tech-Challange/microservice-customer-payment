/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TotemGuard } from '../../../../src/modules/auth/guards/totem.guard';
import { StoresService } from '../../../../src/modules/stores/stores.service';
import { UnauthorizedException } from '@nestjs/common';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';
import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';
import { ExecutionContext } from '@nestjs/common';

describe('TotemGuard', () => {
  let guard: TotemGuard;
  let storesService: StoresService;
  let mockStore: Partial<StoreModel>;
  let mockTotem: Partial<TotemModel>;

  beforeEach(async () => {
    mockTotem = {
      id: 'totem-id-1',
      tokenAccess: 'valid-totem-token',
      name: 'Test Totem',
    };

    mockStore = {
      id: 'store-id-1',
      totems: [mockTotem as TotemModel],
    };

    const storesServiceMock = {
      findByTotemAccessToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotemGuard,
        {
          provide: StoresService,
          useValue: storesServiceMock,
        },
      ],
    }).compile();

    guard = module.get<TotemGuard>(TotemGuard);
    storesService = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when totem token is valid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-totem-token',
        },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(storesService, 'findByTotemAccessToken')
        .mockResolvedValue(mockStore as StoreModel);

      const result = await guard.canActivate(mockExecutionContext);

      expect(storesService.findByTotemAccessToken).toHaveBeenCalledWith(
        'valid-totem-token',
      );
      expect(mockRequest['storeId']).toBe(mockStore.id);
      expect(mockRequest['totemAccessToken']).toBe('valid-totem-token');
      expect(mockRequest['totemId']).toBe(mockTotem.id);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when no token is provided', async () => {
      const mockRequest = {
        headers: {},
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Token not found'),
      );
      expect(storesService.findByTotemAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token format is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidToken',
        },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Token not found'),
      );
      expect(storesService.findByTotemAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-totem-token',
        },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(storesService, 'findByTotemAccessToken')
        .mockRejectedValue(new Error('Store not found'));

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
      expect(storesService.findByTotemAccessToken).toHaveBeenCalledWith(
        'invalid-totem-token',
      );
    });
  });
});
