import { int } from "drizzle-orm/mysql-core";
import { serial, integer, varchar, boolean, json, timestamp } from "drizzle-orm/pg-core";

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
   captionStyle: json("captionStyle").notNull().default({
      color: '#eab308',
      cursor: 'pointer',
      fontWeight: 800,
      textTransform: 'uppercase',
      filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
    }),
   images: varchar("images").array(),
   createdBy: varchar("createdBy").notNull(),
   downloadUrl: varchar("downloadUrl").default('').notNull()
});


export const ImageVideo = pgTable("image_video", {
   id: serial("id").primaryKey(),
   image: json("image").notNull(),
   prompt: varchar("prompt").default(""),
   negative_prompt: varchar("negative_prompt").default(""),
   duration: integer("duration").default(5).notNull(),
   mode: varchar("mode").default("standard").notNull(),
   video: varchar("video").notNull(),
   createdBy: varchar("createdBy").notNull()
});

export const Subscribers = pgTable('subscribers', {
   id: serial("id").primaryKey(),
   email: varchar("email", { length: 255 }).notNull()
});

export const upscaledImages = pgTable('upscaled_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
});

export const removedbgImages = pgTable('removedbg_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
});

export const expandedImages = pgTable('expanded_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   aspectRatio: varchar("aspectRatios").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
});

export const VideoGenerationJobs = pgTable('video_generation_jobs', {
   id: serial("id").primaryKey(),
   jobId: varchar("jobId", { length: 255 }).notNull().unique(),
   userId: varchar("userId", { length: 255 }).notNull(),
   status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, processing, completed, failed
   progress: json("progress").default({}),
   formData: json("formData").notNull(),
   result: json("result"), // stores videoId when completed
   error: varchar("error", { length: 500 }),
   createdAt: varchar("createdAt", { length: 255 }).notNull(),
   updatedAt: varchar("updatedAt", { length: 255 }).notNull()
});

export const SwapFacesImages = pgTable('swap_faces_images', {
   id: serial("id").primaryKey(),
   input_image: varchar("input_image").notNull(),
   swap_image: varchar("swap_image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
});

export const EmojiGenerationImages = pgTable('emoji_generation_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   prompt: varchar("prompt").notNull(),
   style: varchar("style").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
});

export const DubbingVideos = pgTable('dubbing_videos', {
   id: serial("id").primaryKey(),
   video: varchar("video").notNull(),
   finalVideo: varchar("finalVideo").notNull(),
   language: varchar("language").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
});

export const ChatConversations = pgTable('chat_conversations', {
   id: serial("id").primaryKey(),
   title: varchar("title", { length: 255 }).notNull(),
   model: varchar("model", { length: 255 }).notNull(),
   messages: json("messages").notNull().default([]),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull(),
   updatedAt: varchar("updatedAt", {length: 255}).notNull()
});