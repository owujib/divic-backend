import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private logger = Logger;
  private readonly secret: string;
  private readonly expiresIn: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = configService.getOrThrow<string>('JWT_SECRET');
    this.expiresIn = configService.getOrThrow<string>('JWT_EXPIRES_IN');
  }

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: this.secret,
      expiresIn: this.expiresIn,
    });
  }

  verifyToken(token: string): Record<string, any> {
    try {
      return this.jwtService.verify(token, {
        secret: this.secret,
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Session expired please login again');
    }
  }
}
