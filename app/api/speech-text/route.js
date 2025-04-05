import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { storage } from "configs/Firebase";
import { ref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";

export async function POST(req) {
  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    var input = {
      task_name: "S2ST (Speech to Speech translation)",
      input_audio: "https://replicate.delivery/pbxt/JWSAJpKxUszI0scNYatExIXZX2rJ78UBilGXCTq4Ct9BDwTA/sample_input_2.mp3",
      input_text_language: "None",
      max_input_audio_length: 60,
      target_language_text_only: "Norwegian Nynorsk",
      target_language_with_speech: "French",
      input_text: "Hello there!"
    }

    const request = await req.json();

    if (!!request.audioFileUrl) input.input_audio = request.audioFileUrl;
    if (!!request.task) input.task_name = request.task;
    if (!!request.language) input.input_text_language = request.language;
    if (!!request.targetLanguageAudio) input.target_language_text_only = request.targetLanguageAudio;
    if (!!request.targetLanguageAudio) input.target_language_with_speech = request.targetLanguageAudio;
    if (!!request.text) input.input_text = request.text;

    const output = await replicate.run(
      "cjwbw/seamless_communication:668a4fec05a887143e5fe8d45df25ec4c794dd43169b9a11562309b2d45873b0",
      {
        input
      }
    );

    // console.log(output)
    let outputResult = {
      text_output: input.input_text,
      audio_output: input.audioFileUrl
    }

    if (!!output.text_output) {
      outputResult.text_output = output.text_output;
    }

    if (!!output.audio_output) {
      const response = await axios.get(output.audio_output, { responseType: "arraybuffer" });

      const blob = new Blob([response.data], { type: "audio/wav" });

      const fileRef = ref(storage, `audio_files/${Date.now()}.wav`);

      await uploadBytes(fileRef, blob);

      const downloadUrl = await getDownloadURL(fileRef);

      outputResult.audio_output = downloadUrl;
    }

    return NextResponse.json({ result: outputResult });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}