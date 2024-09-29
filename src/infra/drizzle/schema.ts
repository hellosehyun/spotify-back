import { pgTable, serial, integer, varchar, jsonb, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  country: varchar("country").notNull(),
  imgs: jsonb("imgs").array().notNull(),
  bannerImgs: jsonb("banner_imgs").array().notNull(),
  profileEid: varchar("profile_eid").unique().notNull(),
  profileEuri: varchar("profile_euri").unique().notNull(),
  role: varchar("role").notNull(),
  followerCnt: integer("follower_cnt").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
})

export const playlist = pgTable("playlist", {
  id: serial("id").primaryKey().notNull(),
  creatorId: integer("creator_id"),
  playlistEid: varchar("playlist_eid").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
})

// export const playlistLike = pgTable("playlist_like", {
//   id: serial("id").primaryKey().notNull(),
//   likerId: integer("liker_id")
//     .references(() => user.id)
//     .notNull(),
//   playlistId: integer("playlist_id")
//     .references(() => playlist.id)
//     .notNull(),
//   createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { mode: "date" })
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
//   deletedAt: timestamp("deleted_at", { mode: "date" }),
// })

// export const follow = pgTable("follow", {
//   id: serial("id").primaryKey().notNull(),
//   fromId: integer("from_id")
//     .references(() => user.id)
//     .notNull(),
//   toId: integer("to_id")
//     .references(() => user.id)
//     .notNull(),
//   createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { mode: "date" })
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
//   deletedAt: timestamp("deleted_at", { mode: "date" }),
// })

// export const comment = pgTable("comment", {
//   id: serial("id").primaryKey().notNull(),
//   writerId: integer("writer_id")
//     .references(() => user.id)
//     .notNull(),
//   content: text("content").notNull(),
//   createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { mode: "date" })
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
//   deletedAt: timestamp("deleted_at", { mode: "date" }),
// })

// export const reply = pgTable("reply", {
//   id: serial("id").primaryKey().notNull(),
//   writerId: integer("writer_id")
//     .references(() => user.id)
//     .notNull(),
//   parentId: integer("parent_id").references(() => comment.id),
//   content: text("content").notNull(),
//   createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { mode: "date" })
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
//   deletedAt: timestamp("deleted_at", { mode: "date" }),
// })
