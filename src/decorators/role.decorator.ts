import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../types";

export const Role = (role: RoleType) => SetMetadata("role", role);
