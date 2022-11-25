import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { UserInfo } from "firebase-admin/auth";
import { USERS } from "../constants";
import { userConverter } from "../converter";

// 別のファイルに書いくべき?
export type User = Omit<
  UserInfo & {
    role: string;
  },
  "photoURL" | "providerId" | "toJSON" | "phoneNumber"
>;

@Injectable()
export class UsersService {
  private readonly db = admin.firestore();
  async findOne(id: string): Promise<User> {
    const snapshot = await this.db
      .collection(USERS)
      .doc(id)
      .withConverter(userConverter)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();

    return {
      ...doc,
    };
  }
}
