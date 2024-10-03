import { findUser } from "./module/findUser"
import { saveUser } from "./module/saveUser"

export type UserRepo = {
  saveUser(
    arg: Parameters<typeof saveUser>[0],
    tx?: Parameters<typeof saveUser>[1]
  ): ReturnType<typeof saveUser>

  findUser(
    arg: Parameters<typeof findUser>[0],
    tx?: Parameters<typeof findUser>[1]
  ): ReturnType<typeof findUser>
}

export const userRepo: UserRepo = {
  saveUser,
  findUser,
}
