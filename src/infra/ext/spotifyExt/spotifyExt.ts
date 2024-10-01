import { getToken } from "./module/getToken"
import { refreshToken } from "./module/refreshToken"
import { getProfile } from "./module/getProfile"
import { likeTracks } from "./module/likeTracks"
import { dislikeTracks } from "./module/dislikeTracks"
import { getMyLikeTracks } from "./module/getMyLikeTracks"
import { getTracks } from "./module/getTracks"

export interface SpotifyExt {
  getToken(
    params: Parameters<typeof getToken>[0] //
  ): ReturnType<typeof getToken>

  getMyLikeTracks(
    params: Parameters<typeof getMyLikeTracks>[0] //
  ): ReturnType<typeof getMyLikeTracks>

  refreshToken(
    params: Parameters<typeof refreshToken>[0] //
  ): ReturnType<typeof refreshToken>

  getProfile(
    params: Parameters<typeof getProfile>[0] //
  ): ReturnType<typeof getProfile>

  likeTracks(
    params: Parameters<typeof likeTracks>[0] //
  ): ReturnType<typeof likeTracks>

  dislikeTracks(
    params: Parameters<typeof dislikeTracks>[0] //
  ): ReturnType<typeof dislikeTracks>

  getTracks(
    params: Parameters<typeof getTracks>[0] //
  ): ReturnType<typeof getTracks>
}

export const spotifyExt: SpotifyExt = {
  getToken,
  refreshToken,
  getProfile,
  likeTracks,
  dislikeTracks,
  getMyLikeTracks,
  getTracks,
}
