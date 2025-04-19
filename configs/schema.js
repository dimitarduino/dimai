import { serial, integer, varchar, boolean, json } from "drizzle-orm/pg-core";

const { pgTable } = require("drizzle-orm/pg-core");

export const Users = pgTable('users', {
   id: serial("id").primaryKey(),
   ime: varchar("ime", { length: 255 }).notNull(),  // VARCHAR requires length
   email: varchar("email", { length: 255 }).notNull(), 
   slika: varchar("slika", { length: 255 }), 
   pretplata: boolean("pretplata").default(false).notNull(),
   credits: integer("credits").default(30)
});

export const VideoData = pgTable("videos", {
   id: serial("id").primaryKey(),
   script: json("script").notNull(),
   audio: varchar("audio").notNull(),
   captions: json("captions").notNull(),
   images: varchar("images").array(),
   createdBy: varchar("createdBy").notNull(),
   downloadUrl: varchar("downloadUrl").default('').notNull()
})

export const Subscribers = pgTable('subscribers', {
   id: serial("id").primaryKey(),
   email: varchar("email", { length: 255 }).notNull()
});