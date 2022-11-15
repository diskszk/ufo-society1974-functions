import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import helmet from "helmet";
import * as cors from "cors";

import { PUBLISHED_ALBUMS, SONGS } from "./constants";
import { AppModule } from "./app.module";

admin.initializeApp();

const db = admin.firestore();
export const refs = {
  albumsRef: db.collection(PUBLISHED_ALBUMS),
  songsRef: (albumId: string) =>
    db.collection(PUBLISHED_ALBUMS).doc(albumId).collection(SONGS),
};

const server = express();

server.use(helmet());
server.use(cors());

const promiseApplicationReady = NestFactory.create(
  AppModule,
  new ExpressAdapter(server)
).then((app) => app.init());

export const api = functions
  .region("asia-northeast2")
  .https.onRequest(async (...args) => {
    await promiseApplicationReady;
    server(...args);
  });
