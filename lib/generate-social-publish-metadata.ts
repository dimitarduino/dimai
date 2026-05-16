import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  YOUTUBE_DEFAULT_CATEGORY_ID,
  YOUTUBE_UPLOAD_CATEGORIES,
} from "@/lib/youtube-upload-categories";

export const SOCIAL_PUBLISH_TITLE_MAX = 100;

export type SocialPublishMetadata = {
  title: string;
  description: string;
  youtubeTags: string;
  youtubeCategoryId: string;
};

type GeminiSocialMetadata = {
  title?: string;
  description?: string;
  tags?: string;
  youtubeCategoryId?: string;
};

export function scriptTextFromVideoScript(script: unknown): string {
  if (!Array.isArray(script)) return "";
  return script
    .map((scene) => {
      if (typeof scene !== "object" || !scene) return "";
      const t = (scene as { contentText?: string }).contentText;
      return typeof t === "string" ? t.trim() : "";
    })
    .filter(Boolean)
    .join("\n");
}

function parseJsonFromModel(text: string): GeminiSocialMetadata {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1]!.trim() : trimmed;
  return JSON.parse(raw) as GeminiSocialMetadata;
}

function normalizeCategoryId(id: unknown): string {
  const raw = String(id ?? "").trim();
  if (YOUTUBE_UPLOAD_CATEGORIES.some((c) => c.id === raw)) return raw;
  return YOUTUBE_DEFAULT_CATEGORY_ID;
}

function normalizeTitle(raw: unknown): string {
  const t = String(raw ?? "").trim();
  if (!t) return "";
  return t.length <= SOCIAL_PUBLISH_TITLE_MAX
    ? t
    : t.slice(0, SOCIAL_PUBLISH_TITLE_MAX);
}

function normalizeTags(raw: unknown): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return s
    .split(/[#,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .join(", ")
    .slice(0, 2000);
}

function normalizeDescription(raw: unknown): string {
  return String(raw ?? "").trim().slice(0, 2000);
}

export async function generateSocialPublishMetadataFromScript(
  script: unknown,
): Promise<SocialPublishMetadata> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const scriptText = scriptTextFromVideoScript(script);
  if (!scriptText) {
    throw new Error("No script content to generate metadata from.");
  }

  const categoryList = YOUTUBE_UPLOAD_CATEGORIES.map(
    (c) => `${c.id}: ${c.label}`,
  ).join("\n");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are an expert at YouTube Shorts and TikTok publishing.

Given this short-form video script (spoken narration / captions), write metadata optimized for discovery and clicks.

Script:
"""
${scriptText.slice(0, 8000)}
"""

Return JSON only with exactly these keys:
- "title": One line, catchy, includes 2-5 relevant hashtags at the end (e.g. "Did you know this? #shorts #facts"). Maximum ${SOCIAL_PUBLISH_TITLE_MAX} characters total including hashtags and spaces.
- "description": 2-4 short sentences for the video description. Engaging, no hashtag spam in the body. Max 500 characters.
- "tags": Comma-separated YouTube tags (5-12 tags). Plain words only, no # symbols.
- "youtubeCategoryId": Pick the best YouTube category id from this list:
${categoryList}

Default to "24" (Entertainment) or "22" (People & Blogs) for viral educational shorts when unsure.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = parseJsonFromModel(text);

  return {
    title: normalizeTitle(parsed.title),
    description: normalizeDescription(parsed.description),
    youtubeTags: normalizeTags(parsed.tags),
    youtubeCategoryId: normalizeCategoryId(parsed.youtubeCategoryId),
  };
}
