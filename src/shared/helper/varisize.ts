import sharp from "sharp"
import p from "path"
import { nanoid } from "nanoid"
import { Img, Obj } from "../vo"

type Opts = {
  sizes?: [number, number][]
  quality?: number
  path: string
}

type Out = {
  img: Img
  objs: Obj[]
}

export const varisize = async (buffer: Buffer, opts: Opts): Promise<Out> => {
  const {
    sizes = [
      [64, 64],
      [300, 300],
      [640, 640],
    ],
    quality = 80,
    path,
  } = opts

  const results = await Promise.all(
    sizes.map(async ([width, height]) => {
      const key = p.join(path, `${nanoid(20)}.webp`)
      const url = `${process.env.BUCKET_BASE_URL}/${key}`
      const resized = await sharp(buffer)
        .resize({ width, height, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer()

      return { width, height, url, key, buffer: resized }
    })
  )

  return {
    img: Img(
      Object.fromEntries(results.map(({ width, height, url }, i) => [i, { width, height, url }]))
    ),
    objs: results.map(({ key, buffer }) => Obj({ key, buffer })),
  }
}
