import { firestore } from "firebase-admin";
import { User } from "./user.entity";
import { CreateUserDTO, UpdateUserDTO } from "./users.dto";

export const userConverter = {
  toFirestore(user: CreateUserDTO | UpdateUserDTO): firestore.DocumentData {
    return {
      ...user,
      isDeleted: false,
    };
  },

  fromFirestore(
    snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData>
  ): User {
    const data = snapshot.data();

    return {
      email: data.email,
      isDeleted: data.isDeleted,
      isSignedIn: data.isSignedIn,
      role: data.role,
      uid: data.uid,
      username: data.username,
    };
  },
};
