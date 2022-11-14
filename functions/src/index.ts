import { https } from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import helmet from "helmet";
import * as cors from "cors";
import { getAlbums } from "./albums/getAlbums";
import { PUBLISHED_ALBUMS } from "./constants";
import { getAlbum } from "./album/getAlbum";

admin.initializeApp();

const app = express();
app.use(helmet());
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

app.get("/albums/:albumId", async (req, res) => {
  try {
    const album = await getAlbum(req.params.albumId);
    if (!album) {
      res.status(404);
      return;
    }
    res.json(album);
  } catch (err) {
    res.status(500);
    if (err instanceof Error) {
      res.json(err);
    }
  }
});

const api = https.onRequest(app);

export { api };
