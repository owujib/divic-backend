import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { TokenService } from '../shared/token.service';
import { HelperService } from '../shared/helper.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    AuthResolver,
    HelperService,
    ConfigService,
    TokenService,
  ],
  controllers: [],
})
export class AuthModule {}
