import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "./albums.converter";
import { CreateAlbumDTO, UpdateAlbumDTO } from "./albums.dto";
import { ALBUMS, DRAFT_ALBUMS, PUBLISHED_DATE } from "../constants";

@Injectable()
export class AlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly albumsRef: firestore.CollectionReference<firestore.DocumentData>;
  private readonly draftAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.albumsRef = this.db.collection(ALBUMS);
    this.draftAlbumsRef = this.db.collection(DRAFT_ALBUMS);
  }

  async isExist(id: string): Promise<boolean> {
    const snapshot = await this.albumsRef
      .doc(id)
      .withConverter(albumConverter)
      .get();

    return snapshot.exists;
  }

  async findAll(): Promise<Album[]> {
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

  async update(album: UpdateAlbumDTO): Promise<firestore.WriteResult> {
    return await this.albumsRef
      .doc(album.id)
      .withConverter<UpdateAlbumDTO>(albumConverter)
      .update({
        ...album,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async delete(albumId: string): Promise<firestore.WriteResult> {
    return await this.albumsRef
      .doc(albumId)
      .withConverter(albumConverter)
      .delete();
  }

  async unpublish(album: CreateAlbumDTO, id: string) {
    return this.db.runTransaction(async (transaction) => {
      transaction.create(this.draftAlbumsRef.doc(), {
        ...album,
      });

      transaction.delete(this.albumsRef.doc(id));
    });
  }
}
