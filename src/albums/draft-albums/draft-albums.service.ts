import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from "@nestjs/common";
import { firestore } from "firebase-admin";
import {
  PUBLISHED_ALBUMS,
  DRAFT_ALBUMS,
  PUBLISHED_DATE,
} from "../../constants";
import { Album } from "ufo-society1974-definition-types";
import { albumConverter } from "../albums.converter";
import { CreateAlbumDTO, UpdateAlbumDTO } from "../albums.dto";
import { PublishedAlbumsService } from "../published-albums/published-albums.service";

@Injectable()
export class DraftAlbumsService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly draftAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;
  private readonly publicAlbumsRef: firestore.CollectionReference<firestore.DocumentData>;

  constructor(
    @Inject(forwardRef(() => PublishedAlbumsService))
    private publishedAlbumsService: PublishedAlbumsService
  ) {
    if (process.env.NODE_ENV === "test") {
      return;
    }

    this.db = firestore();
    this.draftAlbumsRef = this.db.collection(DRAFT_ALBUMS);
    this.publicAlbumsRef = this.db.collection(PUBLISHED_ALBUMS);
  }

  async isExist(id: string): Promise<boolean> {
    const snapshot = await this.draftAlbumsRef
      .doc(id)
      .withConverter(albumConverter)
      .get();

    return snapshot.exists;
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
      .withConverter<UpdateAlbumDTO>(albumConverter)
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

  async publish(album: CreateAlbumDTO, id: string) {
    // published-albumsに存在する場合、400エラー
    const isExistInPublishedAlbums = await this.publishedAlbumsService.isExist(
      id
    );

    if (isExistInPublishedAlbums) {
      return Promise.reject(
        new BadRequestException("IDと一致するアルバムは既に公開中です。")
      );
    }
    try {
      return await this.db.runTransaction(async (transaction) => {
        transaction.create(this.publicAlbumsRef.doc(), {
          ...album,
        });

        transaction.delete(this.draftAlbumsRef.doc(id));
      });
    } catch {
      return Promise.reject(new InternalServerErrorException());
    }
  }
}
