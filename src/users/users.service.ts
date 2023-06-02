import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { USERS } from "../constants";
import { userConverter } from "./users.converter";
import { User } from "./user.entity";
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";
import * as firebase from "firebase-admin";

@Injectable()
export class UsersService {
  private readonly db: firestore.Firestore;
  private readonly usersRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    // test時にtestを通す為
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.usersRef = this.db.collection(USERS);
  }

  async findAll(): Promise<User[]> {
    // 未削除のユーザーのみを取得する
    const snapshots = await this.usersRef.withConverter(userConverter).get();

    if (snapshots.empty) {
      return [];
    }

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      if (doc.isDeleted === false) {
        return { ...doc };
      }

      return null;
    });
  }

  // 未削除のユーザーのみを取得する
  async findById(id: string): Promise<User | null> {
    const snapshot = await this.usersRef
      .doc(id)
      .withConverter(userConverter)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();

    if (doc.isDeleted) {
      return null;
    }

    return {
      ...doc,
    };
  }

  async create(
    user: CreateUserDTO
  ): Promise<firestore.DocumentReference<User>> {
    return await this.usersRef
      .withConverter(userConverter)
      .add({ ...user, uid: "asd" });
  }

  async update(user: UpdateUserDTO) {
    return;
  }

  // Controllerで異常系をはじいて正常なデータしか処理しない
  async delete(id: string): Promise<firestore.WriteResult> {
    return await this.usersRef.doc(id).withConverter(userConverter).update({
      isDeleted: true,
    });
  }

  async findByEmail(email: string) {
    const auth = firebase.auth();
    try {
      return await auth.getUserByEmail(email);
    } catch {
      return null;
    }
  }
}
