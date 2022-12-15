import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "./albums.converter";
import { CreateAlbumDTO } from "./albums.dto";
import { ALBUMS, PUBLISHED_DATE } from "../constants";

@Injectable()
export class AlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly albumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.albumsRef = this.db.collection(ALBUMS);
  }

  public async findAllAlbums(): Promise<Album[]> {
    const snapshots = await this.albumsRef
      .withConverter<Album>(albumConverter)
      .orderBy(PUBLISHED_DATE, "desc")
      .get();

    if (snapshots.empty) {
      return [];
    }

    return snapshots.docs.map((snapshot) => {
      const doc = snapshot.data();

      return { ...doc };
    });
  }

  async findPublished(): Promise<Album[]> {
    const allAlbums = await this.findAllAlbums();

    // firestoreのwhere句でフィルタリングしようとすると500エラーになる為filterで回避する
    return allAlbums.filter(({ published }) => published === true);
  }

  async findDrafted(): Promise<Album[]> {
    const allAlbums = await this.findAllAlbums();

    // firestoreのwhere句でフィルタリングしようとすると500エラーになる為filterで回避する
    return allAlbums.filter(({ published }) => published === false);
  }

  async findById(id: string): Promise<Album | null> {
    const snapshot = await this.albumsRef
      .doc(id)
      .withConverter(albumConverter)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    const doc = snapshot.data();
    return { ...doc };
  }

  async create(
    album: CreateAlbumDTO
  ): Promise<firestore.DocumentReference<CreateAlbumDTO>> {
    return await this.albumsRef
      .withConverter<CreateAlbumDTO>(albumConverter)
      .add({ ...album });
  }

  async setPublish(albumId: string): Promise<firestore.WriteResult> {
    return await this.albumsRef
      .doc(albumId)
      .withConverter(albumConverter)
      .update({ published: true });
  }

  async setUnpublish(albumId: string): Promise<firestore.WriteResult> {
    return await this.albumsRef
      .doc(albumId)
      .withConverter(albumConverter)
      .update({ published: false });
  }

  async delete(albumId: string): Promise<firestore.WriteResult> {
    return await this.albumsRef
      .doc(albumId)
      .withConverter(albumConverter)
      .delete();
  }
}
