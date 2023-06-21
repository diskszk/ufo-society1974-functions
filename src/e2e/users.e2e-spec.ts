import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../app.module";

const baseUrl = "http://127.0.0.1:5001/ufo-society-1974/asia-northeast2/api";

describe("Users", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/users (GET)", async () => {
    const res = await request(baseUrl).get("/users");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it("/users?email= (GET)", async () => {
    const email = "test@example.com";
    const res = await request(baseUrl).get(`/users?email=${email}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      role: "editor",
      username: "テストユーザー2",
      email: "test@example.com",
      isDeleted: false,
      uid: "VTWhMM3H5AQaPR8QpPkirLJNj9R2",
    });
  });
});
