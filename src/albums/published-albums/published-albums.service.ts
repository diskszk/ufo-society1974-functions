import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from "@nestjs/common";
import { firestore } from "firebase-admin";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../albums.converter";
import { CreateAlbumDTO, UpdateAlbumDTO } from "../albums.dto";
import {
  PUBLISHED_ALBUMS,
  DRAFT_ALBUMS,
  PUBLISHED_DATE,
} from "../../constants";
import { DraftAlbumsService } from "../draft-albums/draft-albums.service";

@Injectable()
export class PublishedAlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly publishedAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;
  private readonly draftAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor(
    @Inject(forwardRef(() => DraftAlbumsService))
    private draftAlbums: DraftAlbumsService
  ) {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.publishedAlbumsRef = this.db.collection(PUBLISHED_ALBUMS);
    this.draftAlbumsRef = this.db.collection(DRAFT_ALBUMS);
  }

  async isExist(id: string): Promise<boolean> {
    const snapshot = await this.publishedAlbumsRef
      .doc(id)
      .withConverter(albumConverter)
      .get();

    return snapshot.exists;
  }

  async findAll(): Promise<Album[]> {
    const snapshots = await this.publishedAlbumsRef
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
    const snapshot = await this.publishedAlbumsRef
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
    return await this.publishedAlbumsRef
      .withConverter<CreateAlbumDTO>(albumConverter)
      .add({ ...album });
  }

  async update(album: UpdateAlbumDTO): Promise<firestore.WriteResult> {
    return await this.publishedAlbumsRef
      .doc(album.id)
      .withConverter<UpdateAlbumDTO>(albumConverter)
      .update({
        ...album,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async delete(albumId: string): Promise<firestore.WriteResult> {
    return await this.publishedAlbumsRef
      .doc(albumId)
      .withConverter(albumConverter)
      .delete();
  }

  async unpublish(album: CreateAlbumDTO, id: string) {
    // draft-albumsに存在する場合エラー
    const isExistInDraftAlbums = await this.draftAlbums.isExist(id);

    if (isExistInDraftAlbums) {
      return Promise.reject(
        new BadRequestException("IDと一致するアルバムは既に非公開中です。")
      );
    }

    try {
      return this.db.runTransaction(async (transaction) => {
        transaction.create(this.draftAlbumsRef.doc(), {
          ...album,
        });

        transaction.delete(this.publishedAlbumsRef.doc(id));
      });
    } catch {
      return Promise.reject(new InternalServerErrorException());
    }
  }
}
