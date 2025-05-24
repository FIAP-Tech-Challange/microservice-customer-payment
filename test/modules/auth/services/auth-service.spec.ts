/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../../src/modules/auth/auth.service';
import { StoresService } from '../../../../src/modules/stores/stores.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';

describe('AuthService', () => {
  let service: AuthService;
  let storesService: StoresService;
  let jwtService: JwtService;
  let mockStore: Partial<StoreModel>;

  beforeEach(async () => {
    mockStore = {
      id: 'store-id-1',
      email: 'store@example.com',
      verifyPassword: jest.fn(),
    };

    const storesServiceMock = {
      findByEmail: jest.fn(),
    };

    const jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: StoresService,
          useValue: storesServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    storesService = module.get<StoresService>(StoresService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const email = 'store@example.com';
      const password = 'correct-password';
      const mockToken = 'mock.jwt.token';

      jest
        .spyOn(storesService, 'findByEmail')
        .mockResolvedValue(mockStore as StoreModel);
      jest.spyOn(mockStore, 'verifyPassword').mockReturnValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await service.login(email, password);

      expect(storesService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockStore.verifyPassword).toHaveBeenCalledWith(password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        storeId: mockStore.id,
        email: mockStore.email,
      });
      expect(result).toBe(mockToken);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const email = 'store@example.com';
      const password = 'wrong-password';

      jest
        .spyOn(storesService, 'findByEmail')
        .mockResolvedValue(mockStore as StoreModel);
      jest.spyOn(mockStore, 'verifyPassword').mockReturnValue(false);

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(storesService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockStore.verifyPassword).toHaveBeenCalledWith(password);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when email is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'any-password';

      jest
        .spyOn(storesService, 'findByEmail')
        .mockRejectedValue(new Error('Store not found'));

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(storesService.findByEmail).toHaveBeenCalledWith(email);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
