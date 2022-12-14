import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class AuthService {
  async validateUser(idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException("認証されていません。");
    }

    try {
      const user = await admin.auth().verifyIdToken(idToken);

      return user;
    } catch {
      throw new ForbiddenException("認可されていません。");
    }
  }
}
