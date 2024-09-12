import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust the import path
import { PrismaService } from '../src/shared/prisma/prisma.service';
import path from 'path';

describe('App (e2e)', () => {
  let app;
  let prismaService: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaService = app.get(PrismaService);

    // Clean up the database before running tests
    await prismaService.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', async () => {
    const registerMutation = `
      mutation {
        register(email: "test@example.com", password: "password123") {
          id
          email
          createdAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: registerMutation })
      .expect(200);

    expect(response.body.data.register.email).toBe('test@example.com');
  });

  it('should login a user', async () => {
    const loginMutation = `
      mutation {
        login(email: "test@example.com", password: "password123") {
          accessToken
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: loginMutation })
      .expect(200);

    token = response.body.data.login.accessToken;
    expect(token).toBeDefined();
  });

  it('should set up biometric login', async () => {
    const biometricSetupMutation = `
      mutation {
        setUpBiometricLogin(biometricKey: "sampleBiometricKey") {
          message
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: biometricSetupMutation })
      .expect(200);

    expect(response.body.data.setUpBiometricLogin.message).toBe('Successful');
  });

  it('should biometric login successfully', async () => {
    const biometricLoginMutation = `
      mutation {
        biometricLogin(biometricKey: "sampleBiometricKey") {
          accessToken
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: biometricLoginMutation })
      .expect(200);

    expect(response.body.data.biometricLogin.accessToken).toBeDefined();
  });

  it('should get logged-in user', async () => {
    const getUserQuery = `
      query {
        getLoggedInUser {
          id
          email
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: getUserQuery })
      .expect(200);

    expect(response.body.data.getLoggedInUser.email).toBe('test@example.com');
  });
});
