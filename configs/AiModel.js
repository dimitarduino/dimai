const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};
export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Write a script to generate 60 seconds video on topic: `The U.S. has no official language.` along with AI image prompt in cartoon format for each scene and give me result in JSON format with imagePrompt and ContentText as field, video should be go viral, so start the first part of the script with some catchy question. Give me JSON only. Result should be in this style: [{imagePrompt: '', contentText: ''}]" },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    "text": "```json\n[\n  {\n    \"imagePrompt\": \"Cartoon style, a person with a bewildered expression scratching their head, looking at a map of the United States with a giant question mark hovering over it. Bright, inviting colors.\",\n    \"contentText\": \"Ever been asked, 'What's the official language of the U.S.?' Your answer is probably English, right? Prepare to be surprised!\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, an astonished Uncle Sam character shrugging his shoulders, with a speech bubble showing 'Nope!' and various international flags subtly in the background.\",\n    \"contentText\": \"Believe it or not, the United States has NO official language at the federal level. That's right, none!\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, a vibrant melting pot overflowing with diverse cartoon characters speaking in different speech bubbles (e.g., Spanish, Mandarin, French, Arabic), all smiling and interacting.\",\n    \"contentText\": \"This unique quirk reflects America's incredible history as a land built by immigrants from every corner of the globe.\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, a historical scene of immigrants disembarking from a ship at Ellis Island, holding small bags, with diverse clothing and hopeful expressions. The Statue of Liberty is in the background.\",\n    \"contentText\": \"From its very beginnings, the U.S. has been a tapestry of cultures, and with them came a rich array of languages.\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, a modern, bustling American city street scene with storefronts displaying signs in multiple languages. Diverse cartoon people are walking and talking, some holding smartphones.\",\n    \"contentText\": \"Today, you can hear over 350 different languages spoken across the nation, from Spanish to Tagalog, Chinese to Navajo.\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, a school classroom with a friendly, diverse group of cartoon children learning together, some pointing at a world map, emphasizing inclusivity.\",\n    \"contentText\": \"While English is the most common language for business and government, the lack of an official language champions linguistic diversity and cultural freedom.\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, a symbolic image of a giant, open book with a global map on its pages, and tiny cartoon people of different nationalities walking across it, representing boundless communication.\",\n    \"contentText\": \"It's a powerful statement about a nation that values individual liberty, including the freedom to speak your mother tongue.\"\n  },\n  {\n    \"imagePrompt\": \"Cartoon style, a quirky cartoon character with a 'Eureka!' lightbulb moment above their head, excitedly sharing this fact with other surprised cartoon characters. Text overlay: 'Mind BLOWN!'\",\n    \"contentText\": \"Pretty mind-blowing, right? Share this surprising fact and let's celebrate the incredible linguistic richness of the USA!\"\n  }\n]\n```"
                  }
            ],
        },
    ],
});

const result = await chatSession.sendMessage("Write a script to generate 60 seconds video on topic: `The U.S. has no official language.` along with AI image prompt in cartoon format for each scene and give me result in JSON format with imagePrompt and ContentText as field, video should be go viral, so start the first part of the script with some catchy question. Give me JSON only. Result should be in this style: [{imagePrompt: '', contentText: ''}]");
console.log(result.response.text());
