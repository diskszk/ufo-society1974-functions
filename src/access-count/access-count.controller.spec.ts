import { Test, TestingModule } from "@nestjs/testing";
import { AccessCountController } from "./access-count.controller";
import { AccessCountModule } from "./access-count.module";
import { AccessCountService } from "./access-count.service";

class DummyAccessCountService {
  async getAccessCount() {
    return 100;
  }
}

describe("AccessCountController", () => {
  let accessCountController: AccessCountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccessCountModule],
    })
      .overrideProvider(AccessCountService)
      .useClass(DummyAccessCountService)
      .compile();

    accessCountController = module.get<AccessCountController>(
      AccessCountController
    );
  });

  it("should be defined", () => {
    expect(accessCountController).toBeDefined();
  });

  it("アクセス数を返す", async () => {
    const { accessCount } = await accessCountController.fetchAccessCount();

    expect(accessCount).toBe(100);
  });
});
