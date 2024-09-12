import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(HttpErrorFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const errorCode = HttpErrorFilter.errorCodeFallBack(exception);

    const errorResponse = {
      success: false,
      error: {
        code: errorCode,
        path: request.url,
        method: request.method,
        message: exception.message,
      },
    };
  }

  static errorCodeFallBack(exception: HttpException) {
    try {
      return exception.getStatus();
    } catch {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
