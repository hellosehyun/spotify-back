import { User } from "@/entity/user/user"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"

type In = {
  user: User
}
type Out = Promise<void>

export const saveUser = async (arg: In, tx = db): Out => {
  const q = tx
    .insert(user) //
    .values(arg.user)

  await q.execute()

  return
}
