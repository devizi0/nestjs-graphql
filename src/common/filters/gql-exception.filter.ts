import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GqlExceptionFilterImpl implements GqlExceptionFilter {
  catch(exception: unknown, _host: ArgumentsHost) {
    if (exception instanceof GraphQLError) return exception;
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';
    return new GraphQLError(message);
  }
}
