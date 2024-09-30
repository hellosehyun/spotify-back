import { Eid } from "@/shared/vo"

type In = {
  accessToken: string
  eids: Eid[]
}

type Out = Promise<{
  ok: boolean
  status: number
}>

export const likeTracks = async (params: In): Out => {
  const res = await fetch("https://api.spotify.com/v1/me/tracks", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: params.eids }),
  })

  return {
    status: res.status,
    ok: res.ok,
  }
}
