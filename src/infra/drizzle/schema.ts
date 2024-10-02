import {
  pgTable,
  serial,
  integer,
  varchar,
  jsonb,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  country: varchar("country").notNull(),
  img: jsonb("img").notNull(),
  bannerImg: jsonb("banner_img").notNull(),
  eid: varchar("eid").unique().notNull(),
  role: varchar("role").notNull(),
  followerCnt: integer("follower_cnt").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
})

export const playlist = pgTable("playlist", {
  id: serial("id").primaryKey().notNull(),
  creatorId: integer("creator_id")
    .references(() => user.id)
    .notNull(),
  img: jsonb("img").notNull(),
  coverImgs: jsonb("cover_imgs").array().notNull(),
  name: varchar("name").notNull(),
  detail: varchar("detail").notNull(),
  type: varchar("type").notNull(),
  isPublic: boolean("is_public").notNull(),
  itemCnt: integer("item_cnt").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
})
export const item = pgTable(
  "item",
  {
    id: serial("id").primaryKey().notNull(),
    playlistId: integer("playlist_id")
      .references(() => playlist.id)
      .notNull(),
    idx: integer("idx").notNull(),
    eid: varchar("eid").notNull(),
    track: jsonb("track").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => {
    return {
      eidIdx: index("item_eid_idx").on(table.eid),
    }
  }
)
