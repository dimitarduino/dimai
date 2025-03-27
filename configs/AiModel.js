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
                { text: "Write a script to generate 60 seconds video on topic: Historical Facts along with AI image prompt in Comic format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No plain text\n" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"imagePrompt\": \"Comic book style illustration of a woolly mammoth being hunted by early humans with spears in a snowy landscape. The style should be vibrant and action-packed, resembling a panel from a classic adventure comic. Focus on dynamic poses and exaggerated expressions.\",\n    \"ContentText\": \"For millennia, woolly mammoths roamed the earth, towering over early humans. These colossal creatures were hunted for their meat and fur, a vital resource for survival in the Ice Age.\"\n  },\n  {\n    \"imagePrompt\": \"A vibrant and detailed comic illustration showing the construction of the Great Pyramid of Giza. Egyptian workers, depicted with strength and determination, are pulling massive stones with ropes and levers. The pyramid is half-finished, with the sun setting in the background. Use a color palette inspired by ancient Egyptian art.\",\n    \"ContentText\": \"The Great Pyramid of Giza, built around 2580–2560 BC, is a testament to ancient Egyptian engineering. It required the labor of thousands and stands as the oldest of the Seven Wonders of the Ancient World.\"\n  },\n  {\n    \"imagePrompt\": \"Comic book scene of Roman soldiers clashing swords with Celtic warriors in a dense forest. The Roman soldiers are in organized formation with their red shields, while the Celts are fiercely attacking with face paint and primitive weapons. The art style should be dynamic and show the chaos of battle, similar to a historical comic book panel.\",\n    \"ContentText\": \"The Roman Empire, known for its military might, clashed with Celtic tribes for centuries. These battles were often brutal and determined the fate of vast territories across Europe.\"\n  },\n  {\n    \"imagePrompt\": \"Comic illustration of a medieval alchemist in his cluttered workshop. He's hunched over bubbling beakers and strange contraptions, with shelves full of dusty books and odd ingredients. Emphasize the mystical atmosphere with glowing potions and dramatic lighting, in a style reminiscent of classic adventure comics.\",\n    \"ContentText\": \"Alchemy, a precursor to modern chemistry, sought to transform base metals into gold and discover the elixir of life. Though ultimately unsuccessful, alchemists laid the groundwork for scientific advancements.\"\n  },\n  {\n    \"imagePrompt\": \"Comic-style depiction of the Boston Tea Party. Colonists disguised as Native Americans are throwing chests of tea into Boston Harbor under the cover of darkness. The scene should be action-packed and slightly humorous, capturing the rebellious spirit of the event. Use a color scheme that evokes the atmosphere of colonial America.\",\n    \"ContentText\": \"The Boston Tea Party in 1773 was a pivotal act of defiance by American colonists against British rule. Disguised as Native Americans, they dumped tea into the harbor to protest unfair taxation.\"\n  },\n  {\n    \"imagePrompt\": \"Comic book style illustration of the Wright brothers making their first successful flight at Kitty Hawk. The scene should capture the excitement and historical significance of the event. The Wright Flyer is slightly tilted and about to take off, with Orville Wright piloting and Wilbur Wright running alongside. Depict the sandy dunes of Kitty Hawk in the background, with a clear blue sky. Use a vintage comic book color palette.\",\n    \"ContentText\": \"On December 17, 1903, the Wright brothers achieved the first successful sustained flight of a powered, heavier-than-air aircraft. This groundbreaking moment ushered in the age of aviation.\"\n  }\n]\n```" },
            ],
        },
    ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
