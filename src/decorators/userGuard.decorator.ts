import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserGuardDecorator = createParamDecorator(
  (property: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const data = request["user"];
    return property ? data?.[property] : data;
  }
);
