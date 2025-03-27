const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-exp-03-25",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [
    ],
    responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "generate me an image of three friends  hugging in the bar\n" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "Here's a thinking process that could lead to the image prompt and the generated image:\n\n1.  **Deconstruct the Request:** The user wants an image of \"three friends hugging in the bar.\"\n\n2.  **Identify Key Elements:**\n    *   **Subject:** Three friends.\n    *   **Action:** Hugging.\n    *   **Setting:** A bar.\n\n3.  **Visualize the Scene:**\n    *   What does a typical bar look like? Dim lighting, maybe some neon, a bar counter, stools, bottles, maybe some tables in the background.\n    *   How do three friends hug? It's likely a group hug, maybe arms around each other's shoulders or waists. It could be celebratory, comforting, or just friendly.\n    *   What's the overall mood? Probably warm, friendly, maybe a bit boisterous or cozy depending on the bar type.\n\n4.  **Translate to Image Generation Prompt Keywords:**\n    *   **Subject:** \"Three friends,\" \"a group of three friends.\"\n    *   **Action:** \"hugging,\" \"group hug,\" \"embracing.\"\n    *   **Setting:** \"in a bar,\" \"at a bar counter,\" \"inside a dimly lit bar,\" \"cozy pub setting.\"\n    *   **Mood/Atmosphere:** \"warm lighting,\" \"friendly atmosphere,\" \"happy,\" \"smiling,\" \"celebrating,\" \"reunion.\"\n    *   **Style/Details (Optional but helpful):** \"photorealistic,\" \"cinematic lighting,\" \"detailed background,\" \"drinks on the bar,\" \"casual clothing.\"\n\n5.  **Draft Initial Prompt Ideas:**\n    *   \"Three friends hugging in a bar.\" (Too simple, might lack detail)\n    *   \"A group of three friends having a group hug inside a dimly lit bar, smiling.\" (Better, adds mood and detail)\n    *   \"Photorealistic image of three diverse friends (e.g., two women, one man) embracing warmly in a cozy pub setting, with drinks on the bar counter in the background, warm lighting.\" (More specific, adds diversity and details)\n    *   \"Three happy friends, mid-twenties, sharing a group hug in a modern bar. One friend is in the middle with arms around the other two. Soft, warm lighting, bar background slightly blurred.\" (Adds age and composition detail)\n\n6.  **Refine the Prompt (Choosing one direction):** Let's go for a generally warm and friendly vibe, photorealistic style. Adding diversity is often a good idea for representation unless the user specifies otherwise.\n\n    *   *Core:* Three friends hugging in a bar.\n    *   *Details:* Make them look happy/content. Specify the bar setting (dim, warm). Add some context (maybe drinks nearby).\n    *   *Style:* Photorealistic.\n\n    *   *Revised Prompt:* \"Photorealistic image capturing a warm moment between three diverse friends sharing a group hug inside a cozy, dimly lit bar. They are smiling, looking happy and connected. The background shows a typical bar setting with soft lighting, perhaps some bottles on shelves or stools at the counter. Focus on the genuine emotion of friendship.\"\n\n7.  **Consider Alternatives/Variations (Self-Correction/Improvement):**\n    *   What if the hug is more celebratory? \"Three friends in a lively bar, raising glasses slightly while in a celebratory group hug.\"\n    *   What if it's more comforting? \"Three friends in a quiet corner of a bar, one friend being comforted by the other two in a supportive group hug, soft warm lighting.\"\n    *   Different compositions? Maybe they are standing near a table, not the bar counter itself. \"Three friends standing near a high-top table in a bar, sharing a heartfelt group hug.\"\n\n8.  **Final Prompt Selection:** The refined prompt (\"Photorealistic image capturing a warm moment...\") seems to capture the core request well with good detail and atmosphere. Let's use that one.\n\n9.  **Generate the Image:** Feed the selected prompt to the image generation model.\n\n10. **Review the Output:** Does the generated image match the prompt?\n    *   Are there three people? Yes.\n    *   Are they friends (implied by hug/expression)? Yes.\n    *   Are they hugging? Yes.\n    *   Is it in a bar setting? Yes.\n    *   Does it match the requested mood/style (warm, cozy, photorealistic)? Yes.\n\n11. **Present the Result:** Show the image to the user with a brief confirmation like \"Okay, here is an image of three friends hugging in a bar:\"" },
                { text: "Okay, here is an image of three friends hugging in a bar:\n![Image of three friends sharing a warm group hug inside a dimly lit, cozy bar setting.](https://image.pollinations.ai/prompt/Photorealistic%20image%20capturing%20a%20warm%20moment%20between%20three%20diverse%20friends%20sharing%20a%20group%20hug%20inside%20a%20cozy%2C%20dimly%20lit%20bar.%20They%20are%20smiling%2C%20looking%20happy%20and%20connected.%20The%20background%20shows%20a%20typical%20bar%20setting%20with%20soft%20lighting%2C%20perhaps%20some%20bottles%20on%20shelves%20or%20stools%20at%20the%20counter.%20Focus%20on%20the%20genuine%20emotion%20of%20friendship.)" },
            ],
        },
    ],
});