import { IsNotEmpty, IsString } from "class-validator";
import { Album } from "ufo-society1974-definition-types";

// idをOmitしたAlbum型をimplementsする
type AlbumDTO = Omit<Album, "id">;

// クライアントから受け取るデータの型チェックを行う
// id, createdAtはfirestoreで生成するため含めない
export class CreateAlbumDTO implements AlbumDTO {
  @IsNotEmpty()
  @IsString()
  description: string;

  imageFile: {
    filename: string;
    path: string;
  } | null;

  @IsNotEmpty()
  @IsString()
  publishedDate: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
