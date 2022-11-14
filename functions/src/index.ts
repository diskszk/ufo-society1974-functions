import { https } from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { getAlbums } from "./albums/getAlbums";
import { PUBLISHED_ALBUMS } from "./constants";

admin.initializeApp();

const app = express();
app.use(cors());

const db = admin.firestore();
export const refs = {
  albumsRef: db.collection(PUBLISHED_ALBUMS),
};

app.get("/albums", async (req, res) => {
  try {
    const albums = await getAlbums();
    res.json(albums);
  } catch (err) {
    res.status(500);
    if (err instanceof Error) {
      res.json(err);
    }
  }
});

const api = https.onRequest(app);

export { api };
