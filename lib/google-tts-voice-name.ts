/** Short Chirp3 HD voice names; full GCP name is `${lang}-Chirp3-HD-${name}`. */
export const CHIRP3_HD_VOICE_NAMES = new Set([
  "Achernar", "Achird", "Algenib", "Algieba", "Alnilam",
  "Aoede", "Autonoe", "Callirrhoe", "Charon", "Despina",
  "Enceladus", "Erinome", "Fenrir", "Gacrux", "Iapetus",
  "Kore", "Laomedeia", "Leda", "Orus", "Pulcherrima",
  "Puck", "Rasalgethi", "Sadachbia", "Sadaltager", "Schedar",
  "Sulafat", "Umbriel", "Vindemiatrix", "Zephyr", "Zubenelgenubi",
]);

export function buildGoogleTtsVoiceName(voice: string, languageCode = "en-US"): string {
  if (CHIRP3_HD_VOICE_NAMES.has(voice)) {
    return `${languageCode}-Chirp3-HD-${voice}`;
  }
  return voice;
}
