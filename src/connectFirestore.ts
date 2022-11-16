import * as admin from "firebase-admin";

export function connectFirestore() {
  admin.initializeApp();

  return { db: admin.firestore() };
}
