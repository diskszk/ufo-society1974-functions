import { IsNotEmpty, IsString } from "class-validator";
import { Album } from "ufo-society1974-definition-types";

// クライアントから受け取るデータの型チェックを行う
// idはfirestoreで生成するため含めない
export class CreateAlbumDTO implements Omit<Album, "id" | "published"> {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  publishedDate: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  imageFile: {
    filename: string;
    path: string;
  } | null;
}

export class UpdateAlbumDTO implements Omit<Album, "published"> {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  publishedDate: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  imageFile: {
    filename: string;
    path: string;
  } | null;
}
