import { getToken } from "./module/getToken"
import { refreshToken } from "./module/refreshToken"
import { getProfile } from "./module/getProfile"
import { play } from "./module/play"
import { like } from "./module/like"
import { dislike } from "./module/dislike"
import { getLikeTracks } from "./module/getLikeTracks"

export interface SpotifyExt {
  getToken(
    params: Parameters<typeof getToken>[0] //
  ): ReturnType<typeof getToken>

  getLikeTracks(
    params: Parameters<typeof getLikeTracks>[0] //
  ): ReturnType<typeof getLikeTracks>

  refreshToken(
    params: Parameters<typeof refreshToken>[0] //
  ): ReturnType<typeof refreshToken>

  getProfile(
    params: Parameters<typeof getProfile>[0] //
  ): ReturnType<typeof getProfile>

  play(
    params: Parameters<typeof play>[0] //
  ): ReturnType<typeof play>

  like(
    params: Parameters<typeof like>[0] //
  ): ReturnType<typeof like>

  dislike(
    params: Parameters<typeof dislike>[0] //
  ): ReturnType<typeof dislike>
}

export const spotifyExt: SpotifyExt = {
  getToken,
  refreshToken,
  getProfile,
  play,
  like,
  dislike,
  getLikeTracks,
}
