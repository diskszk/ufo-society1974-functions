import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleType } from "../types";

/*
  headerからuserのroleを取得してバリデーションを行う
  invalidの場合403エラーを発生させる
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private validateRole(
    validRole: RoleType,
    userRole: RoleType | undefined
  ): boolean {
    if (!userRole) {
      return false;
    }

    return validRole === userRole;
  }

  canActivate(context: ExecutionContext): boolean {
    const validRole = this.reflector.get<RoleType>(
      "role",
      context.getHandler()
    );

    const requests = context.switchToHttp().getRequest<Request>();

    const userRole = requests.headers["role"] as RoleType | undefined;

    const validResult = this.validateRole(validRole, userRole);

    if (validResult) {
      return true;
    } else {
      throw new ForbiddenException("アクセス権限がありません。");
    }
  }
}
