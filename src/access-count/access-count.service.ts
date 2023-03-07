import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";

@Injectable()
export class AccessCountService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly accessCountRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.accessCountRef = this.db.collection("access_count");
  }

  async getAccessCount(): Promise<number> {
    const snapshot = await this.accessCountRef.doc("data").get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();

    return Number(doc.accessCount);
  }

  async increment(currentAccessCount: number): Promise<void> {
    await this.accessCountRef
      .doc("data")
      .set({ accessCount: currentAccessCount + 1 });
  }
}
