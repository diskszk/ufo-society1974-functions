import { Module } from "@nestjs/common";
import { AccessCountController } from "./access-count.controller";
import { AccessCountService } from "./access-count.service";

@Module({
  controllers: [AccessCountController],
  providers: [AccessCountService],
})
export class AccessCountModule {}
