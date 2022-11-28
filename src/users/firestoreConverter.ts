import { FirestoreDataConverter } from "firebase-admin/firestore";
import { UserIdAndRole } from "../types";

export const userConverter: FirestoreDataConverter<UserIdAndRole> = {
  toFirestore(_user: UserIdAndRole) {
    return {};
  },
  fromFirestore(snapshot): UserIdAndRole {
    const data = snapshot.data();

    return {
      uid: data.uid,
      role: data.role,
    };
  },
};
