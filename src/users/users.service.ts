import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { USERS } from "../constants";
import { userConverter } from "./firestoreConverter";
import { UserIdAndRole } from "../types";
import { User } from "ufo-society1974-definition-types";
import { CreateUserDTO } from "./users.dto";

@Injectable()
export class UsersService {
  private readonly db: firestore.Firestore;
  // eslint-disable-next-line max-len
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
    const snapshots = await this.usersRef.withConverter(userConverter).get();

    if (snapshots.empty) {
      return [];
    }

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc };
    });
  }

  async findById(id: string): Promise<UserIdAndRole | null> {
    const snapshot = await this.usersRef
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

  async create(
    user: CreateUserDTO
  ): Promise<firestore.DocumentReference<User>> {
    return await this.usersRef.withConverter(userConverter).add(user);
  }

  // delete(isDeletedをfalseにする)
  async delete(id: string) {
    return await this.usersRef.withConverter(userConverter).doc(id).update({
      isDeleted: true,
    });
  }
}
