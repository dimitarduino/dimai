import "server-only";

import { refreshGoogleAccessToken } from "@/lib/google-oauth-token";

export type ResumableUploadResult = { youtubeVideoId: string };

export async function uploadYoutubeVideoFromUrl(options: {
  accessToken: string;
  refreshToken: string | null;
  onAccessTokenRefresh?: (next: {
    accessToken: string;
    expiresAtIso: string | null;
  }) => Promise<void>;
  videoUrl: string;
  title: string;
  description: string;
}): Promise<ResumableUploadResult> {
  let accessToken = options.accessToken;

  const videoRes = await fetch(options.videoUrl);
  if (!videoRes.ok) {
    throw new Error(`Could not download video file (${videoRes.status})`);
  }
  const buf = Buffer.from(await videoRes.arrayBuffer());
  const size = buf.length;

  const initHeaders = (token: string) =>
    ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": String(size),
      "X-Upload-Content-Type": "video/mp4",
    }) as Record<string, string>;

  const body = JSON.stringify({
    snippet: {
      title: options.title.slice(0, 100),
      description: options.description.slice(0, 5000),
      categoryId: "22",
    },
    status: {
      privacyStatus: "public",
      selfDeclaredMadeForKids: false,
    },
  });

  let initRes: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    initRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: initHeaders(accessToken),
        body,
      },
    );
    if (initRes.status === 401 && options.refreshToken && attempt === 0) {
      const t = await refreshGoogleAccessToken(options.refreshToken);
      accessToken = t.accessToken;
      const expiresAtIso = t.expiresIn
        ? new Date(Date.now() + t.expiresIn * 1000).toISOString()
        : null;
      await options.onAccessTokenRefresh?.({
        accessToken: t.accessToken,
        expiresAtIso,
      });
      continue;
    }
    break;
  }

  if (!initRes || !initRes.ok) {
    const errText = initRes ? await initRes.text() : "";
    throw new Error(`YouTube upload init failed: ${initRes?.status ?? "?"} ${errText}`);
  }

  const uploadUrl = initRes.headers.get("location");
  if (!uploadUrl) {
    throw new Error("YouTube upload init missing Location header");
  }

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Length": String(size),
      "Content-Type": "video/mp4",
    },
    body: buf,
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`YouTube upload failed: ${putRes.status} ${errText}`);
  }

  const json = (await putRes.json()) as { id?: string };
  if (!json.id) {
    throw new Error("YouTube upload response missing video id");
  }
  return { youtubeVideoId: json.id };
}
