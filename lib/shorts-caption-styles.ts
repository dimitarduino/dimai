export const SHORTS_CAPTION_PRESETS = [
  {
    name: "YOUTUBER",
    classesCaption: {
      color: "#eab308",
      cursor: "pointer",
      fontWeight: 800,
      textTransform: "uppercase",
      filter:
        "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
    },
  },
  {
    name: "Superme",
    classesCaption: {
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: 700,
      fontStyle: "italic",
      filter:
        "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
    },
  },
  {
    name: "NEON",
    classesCaption: {
      color: "#22c55e",
      cursor: "pointer",
      fontWeight: 800,
      textTransform: "uppercase",
      filter:
        "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
    },
  },
  {
    name: "GLITCH",
    classesCaption: {
      color: "#ec4899",
      cursor: "pointer",
      fontWeight: 800,
      textTransform: "uppercase",
      filter:
        "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
    },
  },
  {
    name: "FIRE",
    classesCaption: {
      color: "#ef4444",
      cursor: "pointer",
      fontWeight: 800,
      textTransform: "uppercase",
      filter:
        "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
    },
  },
] as const;

export function resolveCaptionStyle(captionName: string) {
  const preset =
    SHORTS_CAPTION_PRESETS.find((c) => c.name === captionName) ??
    SHORTS_CAPTION_PRESETS[0];
  return { ...preset.classesCaption };
}
