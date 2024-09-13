import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../shared/prisma/prisma.service';
import { TokenService } from '../shared/token.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger: LoggerService;

  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(AuthGuard.name);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const graphQlContext = GqlExecutionContext.create(context);
    const { req } = graphQlContext.getContext();

    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      this.logger.error('Please login to access this resource!');

      throw new UnauthorizedException('Please login to access this resource!');
    }

    const decoded = this.tokenService.verifyToken(accessToken);
    /**check if user exists */
    const user = await this.prisma.user.findUnique({
      where: {
        id: decoded?.sub,
      },
      select: {
        password: false,
        id: true,
        email: true,
      },
    });

    if (!user) {
      this.logger.error('Unauthorized access. Please login');
      throw new UnauthorizedException('Unauthorized access. Please login');
    }
    req.user = user;
    return true;
  }
}
