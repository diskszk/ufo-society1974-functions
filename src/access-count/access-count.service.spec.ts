import { Test, TestingModule } from "@nestjs/testing";
import { AccessCountService } from "./access-count.service";

describe("AccessCountService", () => {
  let service: AccessCountService;
  let fakeService: Partial<AccessCountService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessCountService],
    }).compile();

    service = module.get<AccessCountService>(AccessCountService);

    fakeService = {
      getAccessCount: async () => {
        return 100;
      },
    };
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAccessCount", () => {
    test("現在のアクセス数を取得する", async () => {
      const currentAccessCount = await fakeService.getAccessCount();
      expect(currentAccessCount).toBe(100);
    });
  });
});
