import { IsNotEmpty, IsString } from "class-validator";
import { Song } from "ufo-society1974-definition-types";

export class CreateSongDTO implements Omit<Song, "id" | "createdAt"> {
  @IsNotEmpty()
  @IsString()
  lyric: string;

  @IsNotEmpty()
  @IsString()
  story: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  wordsRights: string;

  @IsNotEmpty()
  @IsString()
  musicRights: string;

  songFile: {
    filename: string;
    path: string;
  } | null;
}
