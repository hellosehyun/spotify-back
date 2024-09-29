import { findUser } from "./module/findUser"
import { createUser } from "./module/createUser"

export interface UserRepo {
  findUser(
    params: Parameters<typeof findUser>[0] //
  ): ReturnType<typeof findUser>

  createUser(
    params: Parameters<typeof createUser>[0] //
  ): ReturnType<typeof createUser>
}

export const userRepo: UserRepo = {
  findUser,
  createUser,
}
