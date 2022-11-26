import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { UserInfo } from "firebase-admin/auth";
import { USERS } from "../constants";
import { userConverter } from "../converter";

// 別のファイルに書いくべき?
export type FirebaseUserInfo = Omit<
  UserInfo & {
    role: string;
  },
  "photoURL" | "providerId" | "toJSON" | "phoneNumber"
>;

@Injectable()
export class UsersService {
  private readonly db: firestore.Firestore;

  constructor() {
    // test時にtestを通す為
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
  }

  async findById(id: string): Promise<FirebaseUserInfo | null> {
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
