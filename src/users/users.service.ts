import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { USERS } from "../constants";
import { userConverter } from "./users.converter";
import { User } from "./user.entity";
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";

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
    const snapshots = await this.usersRef
      .withConverter<User>(userConverter)
      .get();

    if (snapshots.empty) {
      return [];
    }

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      if (doc.isDeleted) {
        return null;
      }

      return { ...doc };
    });
  }

  // 未削除のユーザーのみを取得する
  async findById(id: string): Promise<User | null> {
    const snapshot = await this.usersRef
      .doc(id)
      .withConverter<User>(userConverter)
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
  ): Promise<firestore.DocumentReference<CreateUserDTO>> {
    return await this.usersRef
      .withConverter<CreateUserDTO>(userConverter)
      .add({ ...user });
  }

  async update(user: UpdateUserDTO): Promise<firestore.WriteResult> {
    const { uid } = user;
    delete user.uid;

    return await this.usersRef
      .doc(uid)
      .withConverter<UpdateUserDTO>(userConverter)
      .set({ ...user });
  }

  async delete(id: string): Promise<firestore.WriteResult> {
    return await this.usersRef
      .doc(id)
      .withConverter<User>(userConverter)
      .update({
        isDeleted: true,
      });
  }
}
