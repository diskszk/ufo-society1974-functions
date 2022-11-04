import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

admin.initializeApp();

// eg.
export const getAlbums = functions.https.onRequest(async (_req, res) => {
  const snapshots = await admin.firestore().collection("albums").get();

  const albums: Album[] = snapshots.docs.map((snapshot) => {
    const doc = snapshot.data();

    return {
      description: doc.description,
      id: snapshot.id,
      publishedDate: doc.publishedDate,
      title: doc.title,
    };
  });

  res.json({ albums });
});

export type Album = {
  description: string;
  id: string; // random
  publishedDate: string; // YYYY-MM-DD
  title: string;
};
