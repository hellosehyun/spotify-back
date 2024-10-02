type In = {
  code: string
  state: string
}

type Out = Promise<{
  ok: boolean
  status: number
  data:
    | undefined
    | {
        access_token: string
        refresh_token: string
        token_type: string
        expires_in: number
        scope: string
      }
}>

export const getToken = async (arg: In): Out => {
  const sp = new URLSearchParams({
    code: arg.code,
    redirect_uri: process.env.SPOTIFY_OAUTH_REDIRECT_URI!,
    grant_type: "authorization_code",
  })

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
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
