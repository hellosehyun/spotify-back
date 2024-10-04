import { Eid } from "@/shared/vo"

type In = {
  accessToken: string
  eids: Eid[]
}

type Out = Promise<{
  ok: boolean
  status: number
}>

export const unlikeTracks = async (arg: In): Out => {
  const res = await fetch("https://api.spotify.com/v1/me/tracks", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${arg.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: arg.eids }),
  })

  return {
    status: res.status,
    ok: res.ok,
  }
}
