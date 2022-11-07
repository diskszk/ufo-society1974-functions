import { https } from "firebase-functions";
import * as admin from "firebase-admin";
import { ALBUMS } from "./constants";
import { fetchAlbums } from "./query";

admin.initializeApp();

export const albumsRef = admin.firestore().collection(ALBUMS);

export const albums = https.onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405);
  }

  try {
    const albums = await fetchAlbums();

    res.json({ albums });
  } catch (err) {
    res.status(500);
    if (err instanceof Error) {
      res.json({ err: err.message });
    }
  }
});
