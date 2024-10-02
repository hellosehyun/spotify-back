import { createUser } from "./module/createUser"
import { findUser } from "./module/findUser"
import { findUsers } from "./module/findUsers"

export type UserRepo = {
  createUser(
    arg: Parameters<typeof createUser>[0],
    tx?: Parameters<typeof createUser>[1]
  ): ReturnType<typeof createUser>

  findUser(
    arg: Parameters<typeof findUser>[0],
    tx?: Parameters<typeof findUser>[1]
  ): ReturnType<typeof findUser>

  findUsers(
    arg: Parameters<typeof findUsers>[0],
    tx?: Parameters<typeof findUsers>[1]
  ): ReturnType<typeof findUsers>
}

export const userRepo: UserRepo = {
  createUser,
  findUser,
  findUsers,
}
