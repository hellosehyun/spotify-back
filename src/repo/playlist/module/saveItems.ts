import { Item } from "@/entity/item/item"
import { db } from "@/infra/drizzle/db"
import { item } from "@/infra/drizzle/schema"

type In = {
  items: Item[]
}
type Out = Promise<void>

export const saveItems = async (arg: In, tx = db): Out => {
  const q = tx
    .insert(item) //
    .values(arg.items)

  await q.execute()

  return
}
