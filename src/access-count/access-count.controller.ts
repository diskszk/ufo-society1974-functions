import { Controller, Get, Put } from "@nestjs/common";
import { AccessCountService } from "./access-count.service";

interface AccessCountResponse {
  accessCount: number;
}

@Controller("access/count")
export class AccessCountController {
  constructor(private readonly accessCountService: AccessCountService) {}

  @Get()
  async fetchAccessCount(): Promise<AccessCountResponse> {
    const accessCount = await this.accessCountService.getAccessCount();
    return {
      accessCount,
    };
  }

  @Put("increment")
  async incrementAccessCount(): Promise<void> {
    const currentAccessCount = await this.accessCountService.getAccessCount();

    this.accessCountService.increment(currentAccessCount);
  }
}
