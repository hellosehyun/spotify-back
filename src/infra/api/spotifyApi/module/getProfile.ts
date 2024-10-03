type In = {
  accessToken: string
}

type Out = Promise<{
  ok: boolean
  status: number
  data:
    | {
        display_name: string
        id: string
        images: {
          url: string
          height: number
          width: number
        }[]
        uri: string
        followers: { total: number }
        country: string
        email: string
      }
    | undefined
}>

export const getProfile = async (arg: In): Out => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${arg.accessToken}`,
    },
  })

  return {
    status: res.status,
    ok: res.ok,
    data: res.ok ? await res.json() : undefined,
  }
}
