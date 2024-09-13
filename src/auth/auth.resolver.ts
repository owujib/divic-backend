import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './user.model';
import { AuthService } from './auth.service';
import { BiometricLoginInput, LoginInput, RegisterInput } from './dto';
import {
  LoginResponse,
  RegisterResponse,
  SetBiometricResponse,
} from '../types/auth.types';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<{ user: Partial<User> }> {
    return await this.authService.register(registerInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') registerInput: LoginInput,
  ): Promise<{ accessToken: string }> {
    return await this.authService.login(registerInput);
  }

  @Mutation(() => SetBiometricResponse)
  @UseGuards(AuthGuard)
  async setBiometricLogin(
    @Args('biometricInput') biometricLogin: BiometricLoginInput,
    @Context() context: { req: any },
  ): Promise<any> {
    return await this.authService.setUpBiometricLogin(
      biometricLogin,
      context.req,
    );
  }

  @Mutation(() => LoginResponse)
  @UseGuards(AuthGuard)
  async biometricLogin(
    @Args('biometricInput') biometricLogin: BiometricLoginInput,
  ): Promise<{ accessToken: string }> {
    return await this.authService.biometricLogin(biometricLogin);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: any }) {
    return await this.authService.getLoggedInUser(context.req);
  }
}
