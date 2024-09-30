import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Title, Type } from "@/entity/playlist/vo"
import { Track } from "@/entity/track/track"
import { AlbumName, ArtistName, TrackName } from "@/entity/track/vo"
import { User } from "@/entity/user/user"
import { Name as UserName } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { playlist, user } from "@/infra/drizzle/schema"
import { Eid, Id, Img, Page, Timestamp } from "@/shared/vo"
import { sql, eq, and, isNull, or } from "drizzle-orm"

type In = {
  id: Id
  userId: Id
  page: Page
}

type Out = Promise<
  Playlist<{
    id: Id
    imgs: Img[]
    type: Type
    title: Title
    detail: Detail
    isPublic: IsPublic
    createdAt: Timestamp
    creator: User<{
      id: Id
      name: UserName
      imgs: Img[]
    }>
    items: Track<{
      artists: {
        name: ArtistName
        eid: Eid
      }[]
      album: {
        name: AlbumName
        eid: Eid
        imgs: Img[]
      }
      name: TrackName
      eid: Eid
    }>[]
  }>
>

export const getPlaylist = async (params: In, tx = db): Out => {
  const limit = 35
  const offset = (params.page - 1) * limit

  const query = tx
    .select({
      id: playlist.id,
      imgs: playlist.imgs,
      type: playlist.type,
      title: playlist.title,
      detail: playlist.detail,
      isPublic: playlist.isPublic,
      createdAt: playlist.createdAt,
      creator: {
        id: user.id,
        name: user.name,
        imgs: user.imgs,
      },
      items: sql<
        Track<
          {
            id: Id
            name: TrackName
            eid: Eid
            artists: {
              name: ArtistName
              eid: Eid
            }[]
            album: {
              name: AlbumName
              eid: Eid
              imgs: Img[]
            }
          }[]
        >
      >`
        (SELECT json_agg(
          json_build_object(
            'id', i.id,
            'artists', i.artists,
            'album', i.album,
            'name', i.name,
            'eid', i.eid
          ) ORDER BY i.index DESC
        )
        FROM item i 
        WHERE i.playlist_id = ${params.id} AND i.deleted_at IS NULL
        LIMIT ${limit}
        OFFSET ${offset}
        )
      `,
    })
    .from(playlist)
    .innerJoin(user, eq(playlist.creatorId, user.id))
    .where(
      and(
        eq(playlist.id, params.id),
        or(eq(playlist.isPublic, true), eq(playlist.creatorId, params.userId)),
        isNull(playlist.deletedAt)
      )
    )

  const [row] = await query

  const entity = Playlist.create({
    id: Id.create(row.id),
    imgs: row.imgs.map((img) => Img.create(img)),
    type: Type.create(row.type),
    title: Title.create(row.title),
    detail: Detail.create(row.detail),
    isPublic: IsPublic.create(row.isPublic),
    createdAt: Timestamp.create(row.createdAt),
    creator: User.create({
      id: Id.create(row.creator.id),
      name: UserName.create(row.creator.name),
      imgs: row.creator.imgs.map((img) => Img.create(img)),
    }),
    items: await Promise.all(
      row.items.map(
        async (item) =>
          await Track.create({
            artists: item.artists.map((artist) => ({
              name: ArtistName.create(artist.name),
              eid: Eid.create(artist.eid),
            })),
            album: {
              name: AlbumName.create(item.album.name),
              eid: Eid.create(item.album.eid),
              imgs: item.album.imgs.map((img) => Img.create(img)),
            },
            name: TrackName.create(item.name),
            eid: Eid.create(item.eid),
          })
      )
    ),
  })

  return entity
}
