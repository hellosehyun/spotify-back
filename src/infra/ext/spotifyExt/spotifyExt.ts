import { getToken } from "./module/getToken"
import { refreshToken } from "./module/refreshToken"
import { getProfile } from "./module/getProfile"

export interface SpotifyExt {
  getToken(
    params: Parameters<typeof getToken>[0] //
  ): ReturnType<typeof getToken>

  refreshToken(
    params: Parameters<typeof refreshToken>[0] //
  ): ReturnType<typeof refreshToken>

  getProfile(
    params: Parameters<typeof getProfile>[0] //
  ): ReturnType<typeof getProfile>
}

export const spotifyExt: SpotifyExt = {
  getToken,
  refreshToken,
  getProfile,
}
