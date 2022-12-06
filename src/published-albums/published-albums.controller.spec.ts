import { Test, TestingModule } from "@nestjs/testing";
import { PublishedAlbumsController } from "./published-albums.controller";
import { PublishedAlbumsService } from "./published-albums.service";

describe("PublishedAlbumsController", () => {
  let controller: PublishedAlbumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishedAlbumsController],
      providers: [PublishedAlbumsService],
    }).compile();

    controller = module.get<PublishedAlbumsController>(
      PublishedAlbumsController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
