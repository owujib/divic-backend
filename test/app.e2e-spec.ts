import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust the import path
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

describe('App (e2e)', () => {
  let app;
  let prismaService: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

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
        register(registerInput:{email: "test@example.com", password:"password123"}){
          user{
            id
            email
            createdAt
          }
          error{
            message
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: registerMutation })
      .expect(200);

    expect(response.body.data.register.user.email).toBe('test@example.com');
  });

  it('should return a validation error when invalid data is provided', async () => {
    const registerMutation = `
      mutation {
        register(registerInput:{email: "testuser", password:"short"}){
          user{
            id
            email
            createdAt
          }
          error{
            message
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: registerMutation })
      .expect(200);

    expect(response.body.errors[0].message).toContain('Bad Request Exception');
  });

  it('should login a user', async () => {
    const loginMutation = `
      mutation {
      login(loginInput: {email: "test@example.com", password:"password123"}){
          accessToken
          error{
            message
          }
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
        setBiometricLogin(biometricInput: {biometricKey: "1223"}) {
          message
          error{
            message
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: biometricSetupMutation })
      .expect(200);

    expect(response.body.data.setBiometricLogin.message).toBe('Successful');
  });

  it('should login with biometric key', async () => {
    const biometricLoginMutation = `
      mutation {
        biometricLogin(biometricInput: {biometricKey:"1223"}){
          accessToken
          error{
            message
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: biometricLoginMutation })
      .expect(200);

    token = response.body.data.biometricLogin.accessToken;

    expect(response.body.data.biometricLogin).toHaveProperty('accessToken');
  });

  it('should return a validation error when invalid biometric key is provided', async () => {
    const registerMutation = `
      mutation {
        biometricLogin(biometricInput: {biometricKey:"wrong-key"}){
          accessToken
          error{
            message
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: registerMutation })
      .expect(200);

    expect(response.body.errors[0].message).toContain('Invalid biometric key');
  });

  it('should get logged-in   user', async () => {
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
