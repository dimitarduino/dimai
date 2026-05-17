/** Current scheduled / uploaded state for a short video. */
export type VideoSocialUploadStatus = {
  youtubeUploaded: boolean;
  tiktokUploaded: boolean;
  postYoutube: boolean;
  postTiktok: boolean;
  scheduledAt: string | null;
  status: string | null;
  title: string | null;
  description: string | null;
  youtubeTags: string | null;
  youtubeCategoryId: string | null;
  lastError: string | null;
};

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
