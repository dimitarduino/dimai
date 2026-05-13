import "server-only";

export async function refreshTikTokAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  openId: string;
}> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY ?? "";
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET ?? "";
  if (!clientKey || !clientSecret) {
    throw new Error("Missing TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET");
  }

  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const j = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    open_id?: string;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !j.access_token || !j.refresh_token || !j.open_id) {
    throw new Error(
      j.error_description || j.error || "TikTok token refresh failed",
    );
  }
  return {
    accessToken: j.access_token,
    refreshToken: j.refresh_token,
    expiresIn: j.expires_in ?? 86400,
    openId: j.open_id,
  };
}

/** Inbox draft via PULL_FROM_URL (video URL must meet TikTok verified-domain rules). */
export async function tiktokInitInboxVideoFromUrl(options: {
  accessToken: string;
  videoUrl: string;
  title: string;
  description: string;
}): Promise<{ publishId: string }> {
  const body = {
    post_info: {
      title: options.title.slice(0, 220),
      description: options.description.slice(0, 2200),
    },
    source_info: {
      source: "PULL_FROM_URL",
      video_url: options.videoUrl,
    },
  };

  let res = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    res = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_info: {
            source: "PULL_FROM_URL",
            video_url: options.videoUrl,
          },
        }),
      },
    );
  }

  const json = (await res.json()) as {
    data?: { publish_id?: string };
    error?: { code?: string; message?: string };
  };
  if (!res.ok || !json.data?.publish_id) {
    const msg =
      json.error?.message ||
      json.error?.code ||
      (await res.text()).slice(0, 500) ||
      "TikTok init failed";
    throw new Error(msg);
  }
  return { publishId: json.data.publish_id };
}
