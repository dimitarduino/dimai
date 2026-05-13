import { and, eq } from "drizzle-orm";

import { db } from "@/configs/db";
import {
  ScheduledSocialPosts,
  SocialOAuthConnections,
  VideoData,
} from "@/configs/schema";
import { inngest } from "@/lib/inngest";
import { refreshTikTokAccessToken, tiktokInitInboxVideoFromUrl } from "@/lib/tiktok-social-server";
import { uploadYoutubeVideoFromUrl } from "@/lib/youtube-resumable-upload";

function tokenExpiring(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() < Date.now() + 120_000;
}

export const scheduledSocialPublish = inngest.createFunction(
  { id: "scheduled-social-publish", retries: 2 },
  { event: "social/scheduled.publish" },
  async ({ event, step }) => {
    const scheduledPostId = event.data.scheduledPostId as number;
    if (typeof scheduledPostId !== "number" || !Number.isFinite(scheduledPostId)) {
      return;
    }

    const row = await step.run("load-scheduled-post", async () => {
      const r = await db
        .select()
        .from(ScheduledSocialPosts)
        .where(eq(ScheduledSocialPosts.id, scheduledPostId))
        .limit(1);
      return r[0] ?? null;
    });

    if (!row || row.status !== "scheduled") {
      return;
    }

    const when = new Date(row.scheduledAt);
    if (when.getTime() > Date.now()) {
      await step.sleepUntil("wait-until-scheduled", when);
    }

    await step.run("publish", async () => {
      const [post] = await db
        .select()
        .from(ScheduledSocialPosts)
        .where(eq(ScheduledSocialPosts.id, scheduledPostId))
        .limit(1);
      if (!post || post.status !== "scheduled") {
        return;
      }

      const [video] = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, post.videoId))
        .limit(1);

      const now = new Date().toISOString();
      const downloadUrl = video?.downloadUrl?.trim();

      if (!downloadUrl) {
        await db
          .update(ScheduledSocialPosts)
          .set({
            status: "failed",
            lastError:
              "No exported MP4 yet. Open your short, tap Export, and wait for it to finish before the scheduled time (or pick a later time).",
            updatedAt: now,
          })
          .where(eq(ScheduledSocialPosts.id, scheduledPostId));
        return;
      }

      await db
        .update(ScheduledSocialPosts)
        .set({ status: "processing", updatedAt: now })
        .where(eq(ScheduledSocialPosts.id, scheduledPostId));

      let youtubeVideoId: string | null = null;
      let tiktokPublishId: string | null = null;
      const errors: string[] = [];

      if (post.postYoutube) {
        const [conn] = await db
          .select()
          .from(SocialOAuthConnections)
          .where(
            and(
              eq(SocialOAuthConnections.clerkUserId, post.clerkUserId),
              eq(SocialOAuthConnections.provider, "youtube"),
            ),
          )
          .limit(1);
        if (!conn) {
          errors.push("YouTube is not connected.");
        } else {
          try {
            const up = await uploadYoutubeVideoFromUrl({
              accessToken: conn.accessToken,
              refreshToken: conn.refreshToken,
              onAccessTokenRefresh: async (next) => {
                await db
                  .update(SocialOAuthConnections)
                  .set({
                    accessToken: next.accessToken,
                    expiresAt: next.expiresAtIso,
                    updatedAt: new Date().toISOString(),
                  })
                  .where(eq(SocialOAuthConnections.id, conn.id));
              },
              videoUrl: downloadUrl,
              title: post.title,
              description: post.description,
            });
            youtubeVideoId = up.youtubeVideoId;
          } catch (e: unknown) {
            errors.push(
              `YouTube: ${e instanceof Error ? e.message : String(e)}`,
            );
          }
        }
      }

      if (post.postTiktok) {
        const [conn] = await db
          .select()
          .from(SocialOAuthConnections)
          .where(
            and(
              eq(SocialOAuthConnections.clerkUserId, post.clerkUserId),
              eq(SocialOAuthConnections.provider, "tiktok"),
            ),
          )
          .limit(1);
        if (!conn) {
          errors.push("TikTok is not connected.");
        } else {
          try {
            let accessToken = conn.accessToken;
            let refreshToken = conn.refreshToken;
            let expiresAt = conn.expiresAt;

            if (refreshToken && tokenExpiring(expiresAt)) {
              const t = await refreshTikTokAccessToken(refreshToken);
              accessToken = t.accessToken;
              refreshToken = t.refreshToken;
              expiresAt = new Date(
                Date.now() + t.expiresIn * 1000,
              ).toISOString();
              await db
                .update(SocialOAuthConnections)
                .set({
                  accessToken,
                  refreshToken,
                  expiresAt,
                  providerUserId: t.openId,
                  updatedAt: new Date().toISOString(),
                })
                .where(eq(SocialOAuthConnections.id, conn.id));
            }

            const tk = await tiktokInitInboxVideoFromUrl({
              accessToken,
              videoUrl: downloadUrl,
              title: post.title,
              description: post.description,
            });
            tiktokPublishId = tk.publishId;
          } catch (e: unknown) {
            errors.push(
              `TikTok: ${e instanceof Error ? e.message : String(e)}`,
            );
          }
        }
      }

      const wanted =
        (post.postYoutube ? 1 : 0) + (post.postTiktok ? 1 : 0);
      const ok =
        (post.postYoutube && youtubeVideoId ? 1 : 0) +
        (post.postTiktok && tiktokPublishId ? 1 : 0);

      const done = ok === wanted && wanted > 0;
      const doneAt = new Date().toISOString();

      await db
        .update(ScheduledSocialPosts)
        .set({
          status: done ? "completed" : "failed",
          youtubeVideoId: youtubeVideoId,
          tiktokPublishId: tiktokPublishId,
          lastError: done ? null : errors.join("; ").slice(0, 2000),
          updatedAt: doneAt,
        })
        .where(eq(ScheduledSocialPosts.id, scheduledPostId));
    });
  },
);
