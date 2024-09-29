import sharp from "sharp";
import { nanoid } from "nanoid";

interface Options {
  sizes?: { width: number; height: number }[];
  quality?: number;
  path: string;
}

export type VarisizeOut = {
  images: {
    width: number;
    height: number;
    url: string;
  }[];
  objects: {
    key: string;
    buffer: Buffer;
  }[];
};

export async function varisize(
  buffer: Buffer,
  options: Options
): Promise<VarisizeOut> {
  const defaultSizes = [
    { width: 640, height: 640 },
    { width: 300, height: 300 },
    { width: 64, height: 64 },
  ];
  const defaultQuality = 80;

  const { sizes = defaultSizes, quality = defaultQuality, path } = options;

  try {
    const results = await Promise.all(
      sizes.map(async ({ width, height }) => {
        const name = `${nanoid(20)}.webp`;
        const key = `${path}/${name}`;
        const url = `${process.env.BUCKET_BASE_URL}/${key}`;
        const resized = await sharp(buffer) //
          .resize({ width, height, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();

        return {
          image: { width, height, url },
          object: { buffer: resized, key },
        };
      })
    );

    const images = results.map((result) => result.image);
    const objects = results.map((result) => result.object);

    return { images, objects };
  } catch (error) {
    throw error;
  }
}
