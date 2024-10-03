import { ElasticExt } from "@/infra/elastic/elasticExt"

export const initElastic = async (elasticExt: ElasticExt) => {
  try {
    const existence = await elasticExt.getPlaylistExistence()

    if (!existence) {
      await elasticExt.mapPlaylist()
    }
  } catch (err) {
    console.log(err)
  }
}
