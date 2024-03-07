import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ReturnUserDto } from '../../users/dto/return-user.dto';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ReturnUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ReturnUserDto;
  },
);
