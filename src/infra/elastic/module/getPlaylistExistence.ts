import { IndicesExistsResponse } from "@elastic/elasticsearch/lib/api/types"
import { client } from "../helper/client"

type Out = Promise<IndicesExistsResponse>

export const getPlaylistExistence = async (): Out => {
  return await client.indices.exists({
    index: "playlist",
  })
}
