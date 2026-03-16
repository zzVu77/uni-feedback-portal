import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
type BadRequestResponse = {
  message?: string | string[];
};
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // console.log(exception.getResponse());qqq
    const exceptionResponse = exception.getResponse() as BadRequestResponse;
    // console.log('exceptionResponse:', exceptionResponse);
    const messages = exceptionResponse?.message ?? [];

    if (request.method !== 'GET') {
      return response.status(400).json({
        statusCode: 400,
        message: messages,
      });
    }
    const hasParams = Object.keys(request.params || {}).length > 0;
    const hasQuery = Object.keys(request.query || {}).length > 0;
    // const hasBody = Object.keys(request.body || {}).length > 0;

    /**
     * CASE 1: Query invalid → 200 []
     */
    if (hasQuery) {
      return response.status(200).json({
        results: [],
        total: 0,
      });
    }
    /**
     * CASE 2: Param invalid → 404
     */
    // console.log('hasParams:', hasParams);
    // console.log('hasQuery:', hasQuery);
    // console.log('messages:', messages);
    if (hasParams) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Resource not found',
        error: 'Not Found',
      });
    }

    /**
     * CASE 3: Body invalid → keep 400
     */
    return response.status(400).json({
      statusCode: 400,
      message: messages,
    });
  }
}
