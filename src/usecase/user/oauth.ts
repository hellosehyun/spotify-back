type In = void

type Out = {
  url: string
}

export const oauth = () => ({
  execute: (arg: In): Out => {
    const searchParams = new URLSearchParams({
      client_id: process.env.SPOTIFY_OAUTH_CLIENT_ID!,
      redirect_uri: process.env.SPOTIFY_OAUTH_REDIRECT_URI!,
      response_type: "code",
      scope,
      state: getRandomState(16),
    })

    return {
      url: `https://accounts.spotify.com/authorize?${searchParams.toString()}`,
    }
  },
})

const getRandomState = (size: number) => {
  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let text = ""

  for (let i = 0; i < size; i++) {
    text += str.charAt(Math.floor(Math.random() * str.length))
  }

  return text
}

const scope = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "app-remote-control",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-follow-modify",
  "user-follow-read",
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  "user-library-modify",
  "user-library-read",
  "user-read-email",
  "user-read-private",
].join(" ")
