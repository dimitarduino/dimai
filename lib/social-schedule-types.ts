/** Payload saved from the player dialog (YouTube / TikTok schedule). */
export type SocialScheduleSavePayload = {
  postYouTube: boolean;
  postTiktok: boolean;
  scheduledAt: string;
  title: string;
  description: string;
  youtubeCategoryId?: string;
  youtubeTags?: string;
};
