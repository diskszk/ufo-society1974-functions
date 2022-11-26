import { Album, Song } from "ufo-society1974-definition-types";
import { FirebaseUserInfo } from "../users/users.service";

const mockSongs: Song[] = [
  {
    id: "001",
    lyric: "test song lyric1",
    songFile: null,
    story: "test story1",
    title: "test song title1",
    wordsRights: "test word rights1",
    musicRights: "test music rights1",
  },
  {
    id: "002",
    lyric: "test song lyric2",
    songFile: null,
    story: "test story2",
    title: "test song title2",
    wordsRights: "test word rights2",
    musicRights: "test music rights2",
  },
];

const mockAlbums: Album[] = [
  {
    id: "sample01",
    description: "test description1",
    imageFile: null,
    publishedDate: "20200101",
    title: "test title 1",
  },
  {
    id: "sample02",
    description: "test description2",
    imageFile: null,
    publishedDate: "20200101",
    title: "test title 2",
  },
];

const users: FirebaseUserInfo[] = [
  {
    uid: "testuid",
    displayName: "test name",
    email: "test@mail.com",
    role: "editor",
  },
];

export const mockData = {
  songs: mockSongs,
  albums: mockAlbums,
  users,
};
