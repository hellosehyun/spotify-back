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
        images: object[]
        uri: string
        followers: { total: number }
        country: string
        email: string
      }
    | undefined
}>

export const getProfile = async (params: In): Out => {
  const rawResponse = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${params.accessToken}` },
  })

  return {
    status: rawResponse.status,
    ok: rawResponse.ok,
    data: rawResponse.ok ? await rawResponse.json() : undefined,
  }
}
