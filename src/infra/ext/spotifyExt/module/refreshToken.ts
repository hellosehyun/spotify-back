type In = {
  refreshToken: string
}

type Out = Promise<{
  ok: boolean
  status: number
  data:
    | {
        access_token: string
        token_type: string
        expires_in: number
        scope: string
      }
    | undefined
}>

export const refreshToken = async (params: In): Out => {
  const sp = new URLSearchParams({
    refresh_token: params.refreshToken,
    grant_type: "refresh_token",
  })

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_OAUTH_CLIENT_ID!}:${process.env.SPOTIFY_OAUTH_CLIENT_SECRET!}`
      ).toString("base64")}`,
    },
    body: sp,
  })

  return {
    status: res.status,
    ok: res.ok,
    data: res.ok ? await res.json() : undefined,
  }
}
