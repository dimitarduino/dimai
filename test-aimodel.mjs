// Test script for configs/AiModel.js
import 'dotenv/config';
import { chatSession, testAiModel } from './configs/AiModel.js';

async function runTest() {
    console.log("🚀 Testing AI Model...\n");
    
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ Error: GEMINI_API_KEY is not set in environment variables");
        process.exit(1);
    }

    console.log("✅ API Key found");
    console.log("📤 Sending message to Gemini AI...\n");

    try {
        // Test with a custom topic
        const topic = "The Benefits of Meditation";
        console.log(`📝 Topic: ${topic}\n`);
        
        const responseText = await testAiModel(topic);
        
        console.log("✅ Response received!\n");
        console.log("📝 Raw Response:");
        console.log("================");
        console.log(responseText);
        console.log("\n================\n");

        // Try to parse JSON
        try {
            // Remove markdown code blocks if present
            const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const jsonData = JSON.parse(cleanedText);
            
            console.log("✅ Successfully parsed JSON!");
            console.log(`📊 Number of scenes: ${jsonData.length}\n`);
            
            console.log("🎬 Scene Breakdown:");
            console.log("==================");
            jsonData.forEach((scene, index) => {
                console.log(`\nScene ${index + 1}:`);
                console.log(`  🖼️  Image Prompt: ${scene.imagePrompt}`);
                console.log(`  💬 Content: ${scene.contentText}`);
            });
            
        } catch (parseError) {
            console.log("⚠️  Could not parse as JSON. Showing raw response above.");
        }
        
    } catch (error) {
        console.error("❌ Error calling Gemini API:");
        console.error(error.message);
        if (error.response) {
            console.error("Response data:", error.response);
        }
    }
}

// Run the test
runTest().then(() => {
    console.log("\n✅ Test complete!");
}).catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
});
