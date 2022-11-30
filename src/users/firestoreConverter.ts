import {
  DocumentData,
  FirestoreDataConverter,
  Timestamp,
} from "firebase-admin/firestore";
import { User } from "ufo-society1974-definition-types";

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return {
      ...user,
      createdAt: Timestamp.now(),
      isDeleted: false,
    };
  },

  fromFirestore(snapshot): User {
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
