/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { StoreGuard } from '../../../../src/modules/auth/guards/store.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('StoreGuard', () => {
  let guard: StoreGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const jwtServiceMock = {
      verifyAsync: jest.fn(),
    };

    const configServiceMock = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreGuard,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    guard = module.get<StoreGuard>(StoreGuard);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when token is valid', async () => {
      // Create a mock request
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid.jwt.token',
        },
      };

      // Create a simple mock of ExecutionContext
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      const mockJwtSecret = 'test-secret';
      const mockPayload = {
        storeId: 'store-id-1',
        email: 'store@example.com',
      };

      jest.spyOn(configService, 'get').mockReturnValue(mockJwtSecret);
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      const result = await guard.canActivate(mockExecutionContext);

      expect(jwtService.verifyAsync).toHaveBeenCalled();
      expect(mockRequest['storeId']).toBe(mockPayload.storeId);
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
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
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
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid.jwt.token',
        },
      };

      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as unknown as ExecutionContext;

      const mockJwtSecret = 'test-secret';
      jest.spyOn(configService, 'get').mockReturnValue(mockJwtSecret);
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
    });
  });
});
