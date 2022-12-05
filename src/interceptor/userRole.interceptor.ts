import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  UseGuards,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from "../auth/auth.guard";
import { RoleType } from "../types";

/*
  headerからuserのroleを取得してバリデーションを行う
  invalidの場合403エラーを発生させる
 */
@UseGuards(AuthGuard)
@Injectable()
export class UserRoleInterceptor implements NestInterceptor {
  private readonly validRole: RoleType;

  constructor(role: RoleType) {
    this.validRole = role;
  }

  private validateRole(userRole: RoleType): boolean {
    if (this.validRole === userRole) {
      return true;
    } else {
      return false;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const userRole = request.headers["role"] as RoleType | undefined;

    const valid = this.validateRole(userRole);

    if (!valid) {
      throw new ForbiddenException();
    }

    return next.handle();
  }
}
