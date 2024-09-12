import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpErrorFilter } from './shared/http-error/http-error.filter';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(3000);
}
bootstrap();
