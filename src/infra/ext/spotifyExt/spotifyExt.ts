import { getToken } from "./module/getToken"
import { refreshToken } from "./module/refreshToken"
import { getProfile } from "./module/getProfile"
import { playTrack } from "./module/playTrack"
import { likeTracks } from "./module/likeTracks"
import { dislikeTracks } from "./module/dislikeTracks"
import { getLikeTracks } from "./module/getLikeTracks"
import { getTracks } from "./module/getTracks"

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

  playTrack(
    params: Parameters<typeof playTrack>[0] //
  ): ReturnType<typeof playTrack>

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
  playTrack,
  likeTracks,
  dislikeTracks,
  getLikeTracks,
  getTracks,
}
