import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const Users = pgTable('users', {
   id: serial("id").primaryKey(),
   ime: varchar("ime", { length: 255 }).notNull(),  // VARCHAR requires length
   email: varchar("email", { length: 255 }).notNull(), 
   slika: varchar("slika", { length: 255 }), 
   pretplata: boolean("pretplata").default(false).notNull(),
   credits: integer("credits").default(30)
});

export const VideoData = pgTable(
   "videos",
   {
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
      downloadUrl: varchar("downloadUrl").default('').notNull(),
      /** Optional background music URL (voiceover remains primary; mixed in Remotion export). */
      backgroundMusic: varchar("backgroundMusic", { length: 2048 }),
      /** Shared id for multi-part series; null for standalone shorts. */
      seriesGroupId: varchar("seriesGroupId", { length: 64 }),
      /** 0-based part index within the series. */
      seriesPartIndex: integer("seriesPartIndex"),
      /** Total parts in the series (e.g. 5). */
      seriesPartTotal: integer("seriesPartTotal"),
   },
   (t) => [
      index("videos_created_by_idx").on(t.createdBy),
      index("videos_series_group_idx").on(t.seriesGroupId),
   ]
);


export const ImageVideo = pgTable("image_video", {
   id: serial("id").primaryKey(),
   image: json("image").notNull(),
   prompt: varchar("prompt").default(""),
   negative_prompt: varchar("negative_prompt").default(""),
   duration: integer("duration").default(5).notNull(),
   mode: varchar("mode").default("standard").notNull(),
   video: varchar("video").notNull(),
   createdBy: varchar("createdBy").notNull()
}, (t) => [index("image_video_created_by_idx").on(t.createdBy)]);

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
}, (t) => [index("upscaled_images_created_by_idx").on(t.createdBy)]);

export const removedbgImages = pgTable('removedbg_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
}, (t) => [index("removedbg_images_created_by_idx").on(t.createdBy)]);

export const expandedImages = pgTable('expanded_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   aspectRatio: varchar("aspectRatios").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
}, (t) => [index("expanded_images_created_by_idx").on(t.createdBy)]);

export const VideoGenerationJobs = pgTable(
   'video_generation_jobs',
   {
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
   },
   (t) => [
      index("video_jobs_user_id_idx").on(t.userId),
      index("video_jobs_status_idx").on(t.status),
   ]
);

export const SocialOAuthConnections = pgTable(
  "social_oauth_connections",
  {
    id: serial("id").primaryKey(),
    clerkUserId: varchar("clerkUserId", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 32 }).notNull(),
    accessToken: text("accessToken").notNull(),
    refreshToken: text("refreshToken"),
    expiresAt: varchar("expiresAt", { length: 64 }),
    accountLabel: varchar("accountLabel", { length: 512 }),
    providerUserId: varchar("providerUserId", { length: 255 }),
    createdAt: varchar("createdAt", { length: 64 }).notNull(),
    updatedAt: varchar("updatedAt", { length: 64 }).notNull(),
  },
  (t) => [
    uniqueIndex("social_oauth_clerk_provider_uidx").on(t.clerkUserId, t.provider),
  ],
);

export const ScheduledSocialPosts = pgTable(
  "scheduled_social_posts",
  {
    id: serial("id").primaryKey(),
    clerkUserId: varchar("clerkUserId", { length: 255 }).notNull(),
    videoId: integer("videoId").notNull(),
    sourceJobId: varchar("sourceJobId", { length: 255 }).notNull(),
    postYoutube: boolean("postYoutube").default(false).notNull(),
    postTiktok: boolean("postTiktok").default(false).notNull(),
    scheduledAt: varchar("scheduledAt", { length: 64 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: varchar("description", { length: 2000 }).notNull(),
    /** YouTube Data API `snippet.categoryId` (numeric string, e.g. "24"). */
    youtubeCategoryId: varchar("youtubeCategoryId", { length: 10 })
      .notNull()
      .default("24"),
    /** Comma-separated tags for YouTube `snippet.tags` (parsed on upload). */
    youtubeTags: varchar("youtubeTags", { length: 2000 }).notNull().default(""),
    status: varchar("status", { length: 50 }).notNull().default("scheduled"),
    youtubeVideoId: varchar("youtubeVideoId", { length: 128 }),
    tiktokPublishId: varchar("tiktokPublishId", { length: 255 }),
    lastError: varchar("lastError", { length: 2000 }),
    createdAt: varchar("createdAt", { length: 64 }).notNull(),
    updatedAt: varchar("updatedAt", { length: 64 }).notNull(),
  },
  (t) => [uniqueIndex("scheduled_social_source_job_uidx").on(t.sourceJobId)],
);

export const SwapFacesImages = pgTable('swap_faces_images', {
   id: serial("id").primaryKey(),
   input_image: varchar("input_image").notNull(),
   swap_image: varchar("swap_image").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
}, (t) => [index("swap_faces_images_created_by_idx").on(t.createdBy)]);

export const EmojiGenerationImages = pgTable('emoji_generation_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   prompt: varchar("prompt").notNull(),
   style: varchar("style").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
}, (t) => [index("emoji_images_created_by_idx").on(t.createdBy)]);

export const DubbingVideos = pgTable('dubbing_videos', {
   id: serial("id").primaryKey(),
   video: varchar("video").notNull(),
   finalVideo: varchar("finalVideo").notNull(),
   language: varchar("language").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
}, (t) => [index("dubbing_videos_created_by_idx").on(t.createdBy)]);

export const ChatConversations = pgTable('chat_conversations', {
   id: serial("id").primaryKey(),
   title: varchar("title", { length: 255 }).notNull(),
   model: varchar("model", { length: 255 }).notNull(),
   messages: json("messages").notNull().default([]),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull(),
   updatedAt: varchar("updatedAt", {length: 255}).notNull()
}, (t) => [index("chat_conversations_created_by_idx").on(t.createdBy)]);

export const editedImages = pgTable('edited_images', {
   id: serial("id").primaryKey(),
   image: varchar("image").notNull(),
   prompt: varchar("prompt").notNull(),
   finalImage: varchar("finalImage").notNull(),
   createdBy: varchar("createdBy").notNull(),
   createdAt: varchar("createdAt", {length: 255}).notNull()
}, (t) => [index("edited_images_created_by_idx").on(t.createdBy)]);