import jwt from "jsonwebtoken"

interface Token {
  id: string
  role: string
  accessToken: string
  refreshToken: string
  expireAt: number
}

export const encryptToken = (data: Token): string => {
  return jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 3,
  })
}

export const decryptToken = (token: string): Token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as Token
  } catch (err) {
    throw err
  }
}
