import {
  pgTable,
  integer,
  varchar,
  jsonb,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  country: varchar("country").notNull(),
  img: jsonb("img").notNull(),
  bannerImg: jsonb("banner_img").notNull(),
  eid: varchar("eid").unique().notNull(),
  role: varchar("role").notNull(),
  followerCnt: integer("follower_cnt").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
})

export const playlist = pgTable("playlist", {
  id: varchar("id").primaryKey().notNull(),
  creatorId: varchar("creator_id")
    .references(() => user.id)
    .notNull(),
  img: jsonb("img").notNull(),
  coverImgs: jsonb("cover_imgs").array().notNull(),
  name: varchar("name").notNull(),
  detail: varchar("detail").notNull(),
  type: varchar("type").notNull(),
  isPublic: boolean("is_public").notNull(),
  tracks: jsonb("tracks").array().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
})
