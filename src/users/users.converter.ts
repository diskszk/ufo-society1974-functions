import { firestore } from "firebase-admin";
import { User } from "./user.entity";
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";

export const userConverter = {
  toFirestore(user: CreateUserDTO | UpdateUserDTO): firestore.DocumentData {
    return {
      ...user,
    };
  },

  fromFirestore(
    snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData>
  ): User {
    const data = snapshot.data();

    return {
      uid: snapshot.id,
      email: data.email,
      username: data.username,
      role: data.role,
      isDeleted: data.isDeleted,
    };
  },
};
