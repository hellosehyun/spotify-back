import { IndicesCreateResponse } from "@elastic/elasticsearch/lib/api/types"
import { client } from "../helper/client"

type Out = Promise<IndicesCreateResponse>

export const mapPlaylist = async (): Out => {
  return await client.indices.create({
    index: "playlist",
    body: {
      settings: {
        analysis: {
          normalizer: {
            default: {
              type: "custom",
              filter: ["lowercase", "asciifolding"],
            },
          },
          analyzer: {
            default: {
              type: "custom",
              tokenizer: "nori",
              filter: ["lowercase", "asciifolding"],
            },
          },
        },
      },
      mappings: {
        properties: {
          name: { type: "text", analyzer: "default" },
          tracks: {
            type: "nested",
            properties: {
              albumName: { type: "text", analyzer: "default" },
              trackName: { type: "text", analyzer: "default" },
              artistNames: { type: "keyword", normalizer: "default" },
            },
          },
        },
      },
    },
  })
}
