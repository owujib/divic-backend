import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';

import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { LoginInput, RegisterInput } from './dto';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  let user: any;
  let token: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule], //import auth module itself instead of repeating services
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerInput: RegisterInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authResolver.register(registerInput);
      user = result.user;

      expect(result.user).toEqual(user);
    });

    it('should return an error if registration fails', async () => {
      try {
        const registerInput: RegisterInput = {
          email: 'test@example.com',
          password: 'password123',
        };

        await authResolver.register(registerInput);
      } catch (error: any) {
        expect(error).toHaveProperty('response');
        expect(error.response.statusCode).toEqual(409);
      }
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authResolver.login(loginInput);
      token = result.accessToken;

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toEqual(token);
    });

    it('should return an error if login fails', async () => {
      try {
        const loginInput: LoginInput = {
          email: 'test@example.com',
          password: 'wrongpassword',
        };

        await authResolver.login(loginInput);
      } catch (error: any) {
        expect(error).toHaveProperty('response');
        expect(error.response.statusCode).toEqual(400);
        expect(error.response.message).toEqual('Could not verify credentials');
      }
    });
  });

  describe('setBiometricLogin', () => {
    it('should set up biometric login successfully', async () => {
      const result = await authResolver.setBiometricLogin(
        { biometricKey: '12345' },
        { req: { Authorization: `Bearer ${token}`, user } },
      );

      expect(result).toHaveProperty('message');
      expect(result.message).toEqual('Successful');
    });
  });

  describe('biometricLogin', () => {
    it('should log in successfully using biometrics', async () => {
      const result = await authResolver.biometricLogin({
        biometricKey: '12345',
      });

      expect(result).toHaveProperty('accessToken');
    });
    it('should return an error if biometric login fails', async () => {
      try {
        await authResolver.biometricLogin({
          biometricKey: 'invalid-key',
        });
      } catch (error) {
        expect(error).toHaveProperty('response');
        expect(error.response.message).toEqual('Invalid biometric key');
        expect(error.response.statusCode).toEqual(400);
      }
    });
  });
});
