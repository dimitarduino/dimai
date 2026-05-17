import Replicate from "replicate";

import { coerceReplicateFetchUrl } from "@/lib/replicate-fetch-url";
import {
  buildSafeImagePrompt,
  isReplicateNsfwError,
  REPLICATE_IMAGE_NEGATIVE_PROMPT,
} from "@/lib/replicate-image-prompt";

const SDXL_LIGHTNING =
  "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe";

const MAX_ATTEMPTS = 3;

function replicateErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

export async function runReplicateImageWithRetry(
  replicate: Replicate,
  rawPrompt: string,
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const level = Math.min(attempt, 2) as 0 | 1 | 2;
    const prompt = buildSafeImagePrompt(rawPrompt, level);

    try {
      const output = await replicate.run(SDXL_LIGHTNING, {
        input: {
          prompt,
          negative_prompt: REPLICATE_IMAGE_NEGATIVE_PROMPT,
          num_outputs: 1,
          width: 1024,
          height: 1280,
          disable_safety_checker: true
        },
      });

      return coerceReplicateFetchUrl(output);
    } catch (error) {
      lastError = error;
      const message = replicateErrorMessage(error);
      if (!isReplicateNsfwError(message) || attempt === MAX_ATTEMPTS - 1) {
        throw error;
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  throw lastError ?? new Error("Image generation failed");
}
