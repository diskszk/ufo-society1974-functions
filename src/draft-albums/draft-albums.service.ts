import { Injectable } from "@nestjs/common";
import { firestore } from "firebase-admin";
import { ALBUMS, DRAFT_ALBUMS, PUBLISHED_DATE } from "../constants";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../albums/albums.converter";
import { CreateAlbumDTO, UpdateAlbumDTO } from "../albums/albums.dto";

@Injectable()
export class DraftAlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly draftAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;
  private readonly publishedAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor() {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.draftAlbumsRef = this.db.collection(DRAFT_ALBUMS);
    this.publishedAlbumsRef = this.db.collection(ALBUMS);
  }

  async findAll(): Promise<Album[]> {
    const snapshots = await this.draftAlbumsRef
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
    const snapshot = await this.draftAlbumsRef
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
    return await this.draftAlbumsRef
      .withConverter<CreateAlbumDTO>(albumConverter)
      .add({ ...album });
  }

  async update(album: UpdateAlbumDTO): Promise<firestore.WriteResult> {
    return await this.draftAlbumsRef
      .doc(album.id)
      .withConverter<CreateAlbumDTO>(albumConverter)
      .update({
        ...album,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async delete(albumId: string): Promise<firestore.WriteResult> {
    return await this.draftAlbumsRef
      .doc(albumId)
      .withConverter(albumConverter)
      .delete();
  }

  async publish(
    targetAlbum: CreateAlbumDTO
  ): Promise<firestore.DocumentReference<CreateAlbumDTO>> {
    return await this.publishedAlbumsRef
      .withConverter<CreateAlbumDTO>(albumConverter)
      .add({ ...targetAlbum });
  }
}
