import fetch from 'node-fetch';

async function test() {
    const key = process.env.TEXT_TO_SPEECH_APIKEY;
    console.log("Testing with key length:", key ? key.length : "None");
    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/voices?key=${key}`, {
            headers: {
                'Referer': 'http://localhost:3000'
            }
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
        } else {
            console.log("Success! Voices count:", data.voices?.length);
        }
    } catch (err) {
        console.error("Fetch failed", err);
    }
}
test();
