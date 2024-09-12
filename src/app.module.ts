import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as path from 'path';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { TokenService } from './shared/token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**I would have preferred to use this but nestjs was not registering my module globally
     * and there was no time to investigate why this is happening
     * so I opted to use my token service instead
     * */
    // JwtModule.registerAsync({
    //   inject: [ConfigService], // Inject the ConfigService
    //   useFactory: (configService: ConfigService) => {
    //     const secret = configService.getOrThrow<string>('JWT_SECRET');
    //     const expiresIn = configService.getOrThrow<string>('JWT_EXPIRES_IN');

    //     return {
    //       global: true,
    //       secret: secret || 'fallback_secret',
    //       signOptions: {
    //         expiresIn: expiresIn || '3600s',
    //       },
    //     };
    //   },
    // }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'), // Generates schema.gql automatically
      // playground: true,
      // introspection: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [AppService, JwtService],
})
export class AppModule {}
