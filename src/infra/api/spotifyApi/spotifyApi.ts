import { getMyLikeTracks } from "./module/getMyLikeTracks"
import { getProfile } from "./module/getProfile"
import { getToken } from "./module/getToken"
import { getTracks } from "./module/getTracks"
import { refreshToken } from "./module/refreshToken"

export interface SpotifyApi {
  getTracks(
    params: Parameters<typeof getTracks>[0] //
  ): ReturnType<typeof getTracks>

  getToken(
    params: Parameters<typeof getToken>[0] //
  ): ReturnType<typeof getToken>

  refreshToken(
    params: Parameters<typeof refreshToken>[0] //
  ): ReturnType<typeof refreshToken>

  getProfile(
    params: Parameters<typeof getProfile>[0] //
  ): ReturnType<typeof getProfile>

  getMyLikeTracks(
    params: Parameters<typeof getMyLikeTracks>[0] //
  ): ReturnType<typeof getMyLikeTracks>
}

export const spotifyApi: SpotifyApi = {
  getTracks,
  getToken,
  refreshToken,
  getProfile,
  getMyLikeTracks,
}
