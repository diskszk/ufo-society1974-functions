import { Album, Song } from "ufo-society1974-definition-types";
import { User } from "../users/users.service";

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
    imageFile: {
      path: "",
      filename: "",
    },
    publishedDate: "20200101",
    songs: [],
    title: "test title 1",
    publishPlatform: null,
  },
  {
    id: "sample02",
    description: "test description2",
    imageFile: {
      path: "",
      filename: "",
    },
    publishedDate: "20200101",
    songs: [],
    title: "test title 2",
    publishPlatform: null,
  },
];

const users: User[] = [
  {
    uid: "testuid",
    displayName: "test name",
    email: "test@mail.com",
    role: "editor",
  },
];

export const mock = {
  songs: mockSongs,
  albums: mockAlbums,
  users,
};
