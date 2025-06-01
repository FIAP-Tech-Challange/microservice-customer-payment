/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../../src/modules/auth/adapters/primary/auth.controller';
import { SignInInputDto } from '../../../../src/modules/auth/models/dtos/sign-in.dto';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ApiKeyGuard } from 'src/modules/auth/guards/api-key.guard';

@Injectable()
class MockApiKeyGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useClass(MockApiKeyGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token when login is successful', async () => {
      // Arrange
      const signInDto: SignInInputDto = {
        email: 'store@example.com',
        password: 'password123',
      };

      const mockToken = 'mock.jwt.token';
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      // Act
      const result = await controller.login(signInDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should bubble up exceptions from the service', async () => {
      const signInDto: SignInInputDto = {
        email: 'store@example.com',
        password: 'wrong-password',
      };

      const error = new UnauthorizedException('Email or password is incorrect');
      jest.spyOn(authService, 'login').mockRejectedValue(error);

      await expect(controller.login(signInDto)).rejects.toThrow(error);
      expect(authService.login).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });
  });
});
