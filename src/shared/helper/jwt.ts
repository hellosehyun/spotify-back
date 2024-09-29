import jwt from "jsonwebtoken"

interface DecodedToken {
  id: number
  role: string
  accessToken: string
  refreshToken: string
  expireAt: number
}

export const encryptToken = (params: DecodedToken): string => {
  return jwt.sign(params, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 7,
  })
}

export const decryptToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
  } catch (err) {
    throw err
  }
}
