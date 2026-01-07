import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { OrGuard } from './or.guard';

// Mock guards for testing
class MockGuard1 {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}

class MockGuard2 {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}

class MockGuard3 {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    throw new UnauthorizedException('Guard 3 failed');
  }
}

describe('OrGuard', () => {
  let moduleRef: ModuleRef;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ModuleRef,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    moduleRef = module.get<ModuleRef>(ModuleRef);

    // Mock ExecutionContext
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when first guard passes', () => {
    it('should return true without checking other guards', async () => {
      const OrGuardClass = OrGuard(MockGuard1, MockGuard2);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      const result = await orGuardInstance.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });

  describe('when first guard fails but second guard passes', () => {
    it('should return true', async () => {
      const OrGuardClass = OrGuard(MockGuard3, MockGuard1);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      const result = await orGuardInstance.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });

  describe('when all guards fail', () => {
    it('should throw UnauthorizedException', async () => {
      const OrGuardClass = OrGuard(MockGuard3, MockGuard3);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      await expect(
        orGuardInstance.canActivate(mockExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should include error messages in exception', async () => {
      const OrGuardClass = OrGuard(MockGuard3, MockGuard3);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      await expect(
        orGuardInstance.canActivate(mockExecutionContext),
      ).rejects.toThrow(
        'Access denied: All authentication methods failed. Guard 3 failed | Guard 3 failed',
      );
    });
  });

  describe('when guard is found in module container', () => {
    it('should use the instance from container', async () => {
      const mockGuardInstance = new MockGuard1();
      const canActivateSpy = jest.spyOn(mockGuardInstance, 'canActivate');

      const OrGuardClass = OrGuard(MockGuard1);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest
        .spyOn(moduleRef, 'get')
        .mockReturnValue(mockGuardInstance as any);

      const result = await orGuardInstance.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(moduleRef.get).toHaveBeenCalledWith(MockGuard1, {
        strict: false,
      });
      expect(canActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    });
  });

  describe('when guard is not in container', () => {
    it('should create a new instance', async () => {
      const OrGuardClass = OrGuard(MockGuard1);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      const result = await orGuardInstance.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(moduleRef.get).toHaveBeenCalledWith(MockGuard1, {
        strict: false,
      });
    });
  });

  describe('with multiple guards', () => {
    it('should try all guards in order until one passes', async () => {
      class FailGuard1 {
        async canActivate(): Promise<boolean> {
          throw new Error('Fail 1');
        }
      }

      class FailGuard2 {
        async canActivate(): Promise<boolean> {
          throw new Error('Fail 2');
        }
      }

      const OrGuardClass = OrGuard(
        FailGuard1,
        FailGuard2,
        MockGuard1,
        MockGuard2,
      );
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      const result = await orGuardInstance.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });

  describe('with single guard', () => {
    it('should work with only one guard that passes', async () => {
      const OrGuardClass = OrGuard(MockGuard1);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      const result = await orGuardInstance.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw when single guard fails', async () => {
      const OrGuardClass = OrGuard(MockGuard3);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      await expect(
        orGuardInstance.canActivate(mockExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('error handling', () => {
    it('should handle non-Error exceptions', async () => {
      class StringErrorGuard {
        async canActivate(): Promise<boolean> {
          throw 'String error';
        }
      }

      const OrGuardClass = OrGuard(StringErrorGuard, StringErrorGuard);
      const orGuardInstance = new OrGuardClass(moduleRef);

      jest.spyOn(moduleRef, 'get').mockImplementation(() => {
        throw new Error('Not found in container');
      });

      await expect(
        orGuardInstance.canActivate(mockExecutionContext),
      ).rejects.toThrow(
        'Access denied: All authentication methods failed. Authentication failed | Authentication failed',
      );
    });
  });
});
