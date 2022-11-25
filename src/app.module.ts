import { Module } from "@nestjs/common";
import { AuthModule } from "./guard/auth.module";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [AuthModule, UsersModule],
  // TODO: initializeApp()を一箇所で行う
  // imports: [AlbumsModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
