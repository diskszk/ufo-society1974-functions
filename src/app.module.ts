import { Module } from "@nestjs/common";
import { AuthModule } from "./guard/auth.module";
import { AppController } from "./app.controller";

@Module({
  imports: [AuthModule],
  // TODO: initializeApp()を一箇所で行う
  // imports: [AlbumsModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
