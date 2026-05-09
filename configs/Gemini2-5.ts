/**
 * Gemini client scaffold — replace with real `@google/generative-ai` session when wired.
 */
export const chatSession = {
  async sendMessage(
    prompt: string,
  ): Promise<{ response: { text: () => string } }> {
    if (!process.env.GEMINI_API_KEY) {
      return {
        response: {
          text: () =>
            `[stub] Gemini not configured (prompt length ${String(prompt.length)})`,
        },
      };
    }
    throw new Error("Implement Gemini in configs/Gemini2-5.ts using GEMINI_API_KEY");
  },
};
