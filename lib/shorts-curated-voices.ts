/**
 * Curated en-US voices for shorts (preview + generation).
 * Google exposes only four Neural2 male voices; we mix Neural2 and Chirp3 HD so each tab
 * can offer eight options while keeping `ssmlGender` aligned with the official voice list.
 * @see https://cloud.google.com/text-to-speech/docs/voices
 */
export type ShortsVoiceGender = "MALE" | "FEMALE";

export type ShortsCuratedVoice = {
  label: string;
  /** Full Cloud TTS `voice.name`. */
  name: string;
  ssmlGender: ShortsVoiceGender;
};

export const SHORTS_CURATED_VOICES: ShortsCuratedVoice[] = [
  // —— Male (8): 4× Neural2 + 4× Chirp3 HD ——
  { label: "Marcus — Neural2, clear", name: "en-US-Neural2-A", ssmlGender: "MALE" },
  { label: "River — Neural2, steady", name: "en-US-Neural2-D", ssmlGender: "MALE" },
  { label: "Noah — Neural2, direct", name: "en-US-Neural2-I", ssmlGender: "MALE" },
  { label: "Jarvis — Neural2, energetic", name: "en-US-Neural2-J", ssmlGender: "MALE" },
  { label: "Charon — Chirp3 HD", name: "en-US-Chirp3-HD-Charon", ssmlGender: "MALE" },
  { label: "Fenrir — Chirp3 HD", name: "en-US-Chirp3-HD-Fenrir", ssmlGender: "MALE" },
  { label: "Orus — Chirp3 HD", name: "en-US-Chirp3-HD-Orus", ssmlGender: "MALE" },
  { label: "Sadachbia — Chirp3 HD", name: "en-US-Chirp3-HD-Sadachbia", ssmlGender: "MALE" },

  // —— Female (8): 5× Neural2 + 3× Chirp3 HD ——
  { label: "Sarah — Neural2, warm", name: "en-US-Neural2-C", ssmlGender: "FEMALE" },
  { label: "Emma — Neural2, bright", name: "en-US-Neural2-E", ssmlGender: "FEMALE" },
  { label: "Maya — Neural2, smooth", name: "en-US-Neural2-F", ssmlGender: "FEMALE" },
  { label: "Nina — Neural2, calm", name: "en-US-Neural2-G", ssmlGender: "FEMALE" },
  { label: "Holly — Neural2, clear", name: "en-US-Neural2-H", ssmlGender: "FEMALE" },
  { label: "Zephyr — Chirp3 HD", name: "en-US-Chirp3-HD-Zephyr", ssmlGender: "FEMALE" },
  { label: "Aoede — Chirp3 HD", name: "en-US-Chirp3-HD-Aoede", ssmlGender: "FEMALE" },
  { label: "Kore — Chirp3 HD", name: "en-US-Chirp3-HD-Kore", ssmlGender: "FEMALE" },
];

const BY_NAME = new Map(SHORTS_CURATED_VOICES.map((v) => [v.name, v]));

export function getShortsCuratedVoice(name: string): ShortsCuratedVoice | undefined {
  return BY_NAME.get(name);
}

/** Prefer catalog gender for known shorts voices; avoids INVALID_ARGUMENT from wrong ssmlGender. */
export function resolveSsmlGenderForShortsVoice(voiceName: string, formGender: string): ShortsVoiceGender {
  const v = getShortsCuratedVoice(voiceName);
  if (v) return v.ssmlGender;
  if (formGender === "MALE" || formGender === "FEMALE") return formGender;
  return "MALE";
}
