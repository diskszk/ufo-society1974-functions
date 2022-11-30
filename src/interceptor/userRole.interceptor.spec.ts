import { UserRoleInterceptor } from "./userRole.interceptor";

describe("RequestInterceptor", () => {
  it("should be defined", () => {
    expect(new UserRoleInterceptor("editor")).toBeDefined();
  });
});
