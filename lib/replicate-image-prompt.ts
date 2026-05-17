/** Replicate SDXL safety: negative prompt + prompt shaping. */
export const REPLICATE_IMAGE_NEGATIVE_PROMPT =
  "nsfw, nude, naked, nudity, sexual, erotic, porn, gore, blood, violence, weapons, gun, knife, scary, horror, disturbing, grotesque, deformed, ugly";

const STRIP_PHRASES = [
  /\s*-\s*make it safe for nsfw\.?/gi,
  /make it safe for nsfw\.?/gi,
  /\bnsfw\b/gi,
];

const SOFTEN_REPLACEMENTS: [RegExp, string][] = [
  [/\bblood(y)?\b/gi, "red glow"],
  [/\bgore\b/gi, ""],
  [/\bviolent\b/gi, "energetic"],
  [/\bviolence\b/gi, "action"],
  [/\bweapon(s)?\b/gi, "object"],
  [/\bkill(ing|ed)?\b/gi, "defeat"],
  [/\bdeath\b/gi, "pause"],
  [/\bdying\b/gi, "resting"],
  [/\bdead\b/gi, "still"],
  [/\bnude\b/gi, ""],
  [/\bnaked\b/gi, "fully clothed"],
  [/\bsexy\b/gi, "friendly"],
  [/\berotic\b/gi, ""],
  [/\bweakening\b/gi, "tired"],
  [/\blosing focus\b/gi, "looking thoughtful"],
  [/\bhorror\b/gi, "mystery"],
  [/\bscary\b/gi, "surprising"],
  [/\bterrifying\b/gi, "dramatic"],
  [/\bfight(ing)?\b/gi, "competing"],
  [/\battack(ing)?\b/gi, "approaching"],
];

export function isReplicateNsfwError(message: string): boolean {
  return /nsfw|safety|content.?policy|moderation|not allowed/i.test(message);
}

function cleanWhitespace(text: string): string {
  return text.replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").trim();
}

/**
 * @param level 0 = light cleanup, 1 = soften triggers, 2 = generic fallback scene
 */
export function buildSafeImagePrompt(raw: string, level: 0 | 1 | 2): string {
  let text = raw.trim();
  for (const re of STRIP_PHRASES) {
    text = text.replace(re, "");
  }
  text = cleanWhitespace(text);

  if (level >= 1) {
    for (const [re, rep] of SOFTEN_REPLACEMENTS) {
      text = text.replace(re, rep);
    }
    text = cleanWhitespace(text);
  }

  if (level >= 2) {
    const theme =
      text.split(/[.!?]/).find((s) => s.trim().length > 8)?.trim() ||
      "a calm everyday moment";
    text = `Peaceful wholesome illustration, soft colors, friendly characters, no violence or fear. Theme: ${theme.slice(0, 100)}`;
  }

  const prefix =
    level === 0
      ? "SFW, family-friendly, wholesome, no nudity, no violence, no gore. "
      : level === 1
        ? "G-rated wholesome cartoon, cheerful, safe for all ages. "
        : "";

  return `${prefix}${text}`.slice(0, 500);
}
