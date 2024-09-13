import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { User } from './user.model';
import { BiometricLoginInput, LoginInput, RegisterInput } from './dto';
import { HelperService } from '../shared/helper.service';
import { TokenService } from '../shared/token.service';

@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    private prisma: PrismaService,
    private readonly helperService: HelperService,
    private readonly tokenService: TokenService,
  ) {
    this.logger = new Logger(AuthService.name);
  }
  async register({ email, password }: RegisterInput): Promise<{ user: User }> {
    const userExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    /**check if email exist */
    if (userExist) {
      this.logger.error(`${email} already exist`);

      throw new ConflictException(`${email} already exist`);
    }

    const user = await this.prisma.user.create({
      data: { email, password: this.helperService.hashPassword(password) },
    });

    return { user };
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    /**throw error message */
    if (!user) {
      this.logger.error(`no user with ${email} was found`);
      throw new BadRequestException('Could not verify credentials');
    }

    /**compare passwords */
    const isCorrectPassword = this.helperService.comparePasswords(
      password,
      user.password,
    );

    /** throw same error  */
    if (!isCorrectPassword) {
      this.logger.error('Incorrect password');

      //send generic error message to client
      throw new BadRequestException('Could not verify credentials');
    }

    /**return generated accessToken */
    return {
      accessToken: this.tokenService.generateAccessToken({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  async setUpBiometricLogin(
    { biometricKey }: BiometricLoginInput,
    req: any,
  ): Promise<{ message: string }> {
    const hashBiometricKey = this.helperService.hashBiometricKey(biometricKey);

    await this.prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        biometricKey: hashBiometricKey,
      },
    });

    return {
      message: 'Successful',
    };
  }

  async biometricLogin({
    biometricKey,
  }: BiometricLoginInput): Promise<{ accessToken: string }> {
    const hashedBiometricKey =
      this.helperService.hashBiometricKey(biometricKey);

    const user = await this.prisma.user.findFirst({
      where: { biometricKey: hashedBiometricKey }, // Find the user with the hashed biometric key
    });

    if (!user) {
      throw new BadRequestException('Invalid biometric key');
    }

    return {
      accessToken: this.tokenService.generateAccessToken({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  async getLoggedInUser(req: any) {
    return req.user;
  }
}
