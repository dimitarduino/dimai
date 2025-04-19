import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import RemotionVideo from '../app/app/_components/RemotionVideo';

const videoData = {
  captions: [
    {
      "text": "Once",
      "start": 240,
      "end": 352,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "upon",
      "start": 352,
      "end": 680,
      "confidence": 0.67995,
      "speaker": null
    },
    {
      "text": "a",
      "start": 712,
      "end": 872,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "time,",
      "start": 896,
      "end": 1272,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "high",
      "start": 1376,
      "end": 1640,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "in",
      "start": 1680,
      "end": 1832,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "the",
      "start": 1856,
      "end": 1992,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "sky,",
      "start": 2016,
      "end": 2408,
      "confidence": 0.99913,
      "speaker": null
    },
    {
      "text": "lived",
      "start": 2504,
      "end": 2808,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "a",
      "start": 2824,
      "end": 2952,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "little",
      "start": 2976,
      "end": 3160,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "dragon",
      "start": 3200,
      "end": 3624,
      "confidence": 0.9432,
      "speaker": null
    },
    {
      "text": "egg.",
      "start": 3672,
      "end": 4328,
      "confidence": 0.92409,
      "speaker": null
    },
    {
      "text": "One",
      "start": 4504,
      "end": 4888,
      "confidence": 0.99912,
      "speaker": null
    },
    {
      "text": "sunny",
      "start": 4944,
      "end": 5304,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "morning.",
      "start": 5352,
      "end": 5752,
      "confidence": 0.99952,
      "speaker": null
    },
    {
      "text": "Crack.",
      "start": 5856,
      "end": 6504,
      "confidence": 0.97839,
      "speaker": null
    },
    {
      "text": "Sparky",
      "start": 6632,
      "end": 7256,
      "confidence": 0.76605,
      "speaker": null
    },
    {
      "text": "the",
      "start": 7288,
      "end": 7384,
      "confidence": 0.99949,
      "speaker": null
    },
    {
      "text": "Dragon",
      "start": 7392,
      "end": 7736,
      "confidence": 0.96685,
      "speaker": null
    },
    {
      "text": "was",
      "start": 7768,
      "end": 8008,
      "confidence": 0.99983,
      "speaker": null
    },
    {
      "text": "born.",
      "start": 8064,
      "end": 8584,
      "confidence": 0.91883,
      "speaker": null
    },
    {
      "text": "Sparky",
      "start": 8712,
      "end": 9384,
      "confidence": 0.97665,
      "speaker": null
    },
    {
      "text": "wanted",
      "start": 9432,
      "end": 9688,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "to",
      "start": 9704,
      "end": 9832,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "fly,",
      "start": 9856,
      "end": 10184,
      "confidence": 0.99995,
      "speaker": null
    },
    {
      "text": "but",
      "start": 10232,
      "end": 10488,
      "confidence": 0.5311,
      "speaker": null
    },
    {
      "text": "his",
      "start": 10544,
      "end": 10760,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "little",
      "start": 10800,
      "end": 11000,
      "confidence": 0.99987,
      "speaker": null
    },
    {
      "text": "wings",
      "start": 11040,
      "end": 11464,
      "confidence": 0.95787,
      "speaker": null
    },
    {
      "text": "just",
      "start": 11512,
      "end": 11672,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "wouldn't",
      "start": 11696,
      "end": 12056,
      "confidence": 0.99892,
      "speaker": null
    },
    {
      "text": "work.",
      "start": 12088,
      "end": 12712,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "He",
      "start": 12896,
      "end": 13192,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "tumbled",
      "start": 13216,
      "end": 13624,
      "confidence": 0.63635,
      "speaker": null
    },
    {
      "text": "and",
      "start": 13672,
      "end": 13832,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "wobbled,",
      "start": 13856,
      "end": 14472,
      "confidence": 0.99711,
      "speaker": null
    },
    {
      "text": "making",
      "start": 14536,
      "end": 14760,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "the",
      "start": 14800,
      "end": 14952,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "cloud",
      "start": 14976,
      "end": 15272,
      "confidence": 0.83489,
      "speaker": null
    },
    {
      "text": "creatures",
      "start": 15336,
      "end": 15752,
      "confidence": 0.99901,
      "speaker": null
    },
    {
      "text": "giggle.",
      "start": 15816,
      "end": 16440,
      "confidence": 0.99943,
      "speaker": null
    },
    {
      "text": "A",
      "start": 16520,
      "end": 16712,
      "confidence": 0.99987,
      "speaker": null
    },
    {
      "text": "wise",
      "start": 16736,
      "end": 16984,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "old",
      "start": 17032,
      "end": 17240,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "owl",
      "start": 17280,
      "end": 17624,
      "confidence": 0.64845,
      "speaker": null
    },
    {
      "text": "saw",
      "start": 17672,
      "end": 17880,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "Sparky's",
      "start": 17920,
      "end": 18536,
      "confidence": 0.87657,
      "speaker": null
    },
    {
      "text": "struggle",
      "start": 18568,
      "end": 18856,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "and",
      "start": 18888,
      "end": 19080,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "hooted.",
      "start": 19120,
      "end": 19640,
      "confidence": 0.98961,
      "speaker": null
    },
    {
      "text": "Little",
      "start": 19720,
      "end": 20008,
      "confidence": 0.98187,
      "speaker": null
    },
    {
      "text": "one",
      "start": 20064,
      "end": 20424,
      "confidence": 0.9973,
      "speaker": null
    },
    {
      "text": "Flying",
      "start": 20512,
      "end": 20952,
      "confidence": 0.98297,
      "speaker": null
    },
    {
      "text": "takes",
      "start": 21016,
      "end": 21336,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "practice",
      "start": 21368,
      "end": 21656,
      "confidence": 0.58959,
      "speaker": null
    },
    {
      "text": "and",
      "start": 21688,
      "end": 21928,
      "confidence": 0.92406,
      "speaker": null
    },
    {
      "text": "believing",
      "start": 21984,
      "end": 22296,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "in",
      "start": 22328,
      "end": 22520,
      "confidence": 0.93244,
      "speaker": null
    },
    {
      "text": "yourself.",
      "start": 22560,
      "end": 23340,
      "confidence": 0.99978,
      "speaker": null
    },
    {
      "text": "Sparky",
      "start": 23760,
      "end": 24424,
      "confidence": 0.99261,
      "speaker": null
    },
    {
      "text": "took",
      "start": 24472,
      "end": 24632,
      "confidence": 0.99987,
      "speaker": null
    },
    {
      "text": "a",
      "start": 24656,
      "end": 24744,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "deep",
      "start": 24752,
      "end": 24936,
      "confidence": 0.99981,
      "speaker": null
    },
    {
      "text": "breath,",
      "start": 24968,
      "end": 25320,
      "confidence": 0.99871,
      "speaker": null
    },
    {
      "text": "believing,",
      "start": 25400,
      "end": 25668,
      "confidence": 0.38823,
      "speaker": null
    },
    {
      "text": "believed",
      "start": 25704,
      "end": 25996,
      "confidence": 0.99929,
      "speaker": null
    },
    {
      "text": "in",
      "start": 26028,
      "end": 26172,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "himself,",
      "start": 26196,
      "end": 26572,
      "confidence": 0.99983,
      "speaker": null
    },
    {
      "text": "and",
      "start": 26636,
      "end": 26908,
      "confidence": 0.91474,
      "speaker": null
    },
    {
      "text": "soared",
      "start": 26964,
      "end": 27324,
      "confidence": 0.54651,
      "speaker": null
    },
    {
      "text": "into",
      "start": 27372,
      "end": 27580,
      "confidence": 0.99932,
      "speaker": null
    },
    {
      "text": "the",
      "start": 27620,
      "end": 27772,
      "confidence": 0.99995,
      "speaker": null
    },
    {
      "text": "sky.",
      "start": 27796,
      "end": 28460,
      "confidence": 0.99988,
      "speaker": null
    },
    {
      "text": "He",
      "start": 28620,
      "end": 28940,
      "confidence": 0.99978,
      "speaker": null
    },
    {
      "text": "flew",
      "start": 28980,
      "end": 29244,
      "confidence": 0.95527,
      "speaker": null
    },
    {
      "text": "over",
      "start": 29292,
      "end": 29548,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "hills",
      "start": 29604,
      "end": 29868,
      "confidence": 0.99986,
      "speaker": null
    },
    {
      "text": "and",
      "start": 29884,
      "end": 30060,
      "confidence": 0.98829,
      "speaker": null
    },
    {
      "text": "oceans,",
      "start": 30100,
      "end": 30636,
      "confidence": 0.6222,
      "speaker": null
    },
    {
      "text": "happy",
      "start": 30748,
      "end": 31116,
      "confidence": 0.99979,
      "speaker": null
    },
    {
      "text": "as",
      "start": 31148,
      "end": 31292,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "could",
      "start": 31316,
      "end": 31500,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "be.",
      "start": 31540,
      "end": 31980,
      "confidence": 0.99974,
      "speaker": null
    },
    {
      "text": "From",
      "start": 32100,
      "end": 32332,
      "confidence": 0.99995,
      "speaker": null
    },
    {
      "text": "that",
      "start": 32356,
      "end": 32540,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "day",
      "start": 32580,
      "end": 32732,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "on,",
      "start": 32756,
      "end": 33036,
      "confidence": 0.99982,
      "speaker": null
    },
    {
      "text": "Sparky",
      "start": 33108,
      "end": 33724,
      "confidence": 0.93556,
      "speaker": null
    },
    {
      "text": "and",
      "start": 33772,
      "end": 33932,
      "confidence": 0.99939,
      "speaker": null
    },
    {
      "text": "his",
      "start": 33956,
      "end": 34092,
      "confidence": 0.99989,
      "speaker": null
    },
    {
      "text": "friends",
      "start": 34116,
      "end": 34444,
      "confidence": 0.9998,
      "speaker": null
    },
    {
      "text": "played",
      "start": 34532,
      "end": 34828,
      "confidence": 0.99988,
      "speaker": null
    },
    {
      "text": "together",
      "start": 34884,
      "end": 35148,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "in",
      "start": 35204,
      "end": 35372,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "the",
      "start": 35396,
      "end": 35532,
      "confidence": 0.99985,
      "speaker": null
    },
    {
      "text": "sky,",
      "start": 35556,
      "end": 36076,
      "confidence": 0.99953,
      "speaker": null
    },
    {
      "text": "proving",
      "start": 36188,
      "end": 36556,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "that",
      "start": 36588,
      "end": 36780,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "anything",
      "start": 36820,
      "end": 37116,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "is",
      "start": 37148,
      "end": 37292,
      "confidence": 0.99983,
      "speaker": null
    },
    {
      "text": "possible",
      "start": 37316,
      "end": 37596,
      "confidence": 0.99617,
      "speaker": null
    },
    {
      "text": "if",
      "start": 37668,
      "end": 37900,
      "confidence": 0.96687,
      "speaker": null
    },
    {
      "text": "you",
      "start": 37940,
      "end": 38092,
      "confidence": 0.99975,
      "speaker": null
    },
    {
      "text": "believe.",
      "start": 38116,
      "end": 38180,
      "confidence": 0.99975,
      "speaker": null
    }
  ],
  images: [
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745063367021.png?alt=media&token=330025db-adbe-4a89-a1da-3d0fbc17f030",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745063413190.png?alt=media&token=2d42d5bc-d5c0-4932-aba4-88a28ea7246e",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745063456595.png?alt=media&token=3055d7b1-b940-457a-b9ae-a4decf54c770",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745063518659.png?alt=media&token=0ff68c7c-7c1e-43bc-86ac-0db390a09572",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745063575349.png?alt=media&token=7bc9a6f2-6608-40d9-8ec3-aef4cce28274"
  ],
  audio: 'https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F745092cc-9946-4380-a15e-06462f3fa54f.mp3?alt=media&token=7c788b19-72d3-487a-9aa4-a86f51e5e4a3',
  script: [
    {
      "imagePrompt": "Cartoon illustration of a friendly purple dragon named Sparky hatching from a bright blue egg in a cozy nest made of soft clouds. The background is a sunny sky with fluffy white clouds and a rainbow. Style: Cute, colorful, and whimsical.",
      "ContentText": "Once upon a time, high in the sky, lived a little dragon egg. One sunny morning... crack! Sparky the dragon was born!"
    },
    {
      "imagePrompt": "Cartoon scene of Sparky the purple dragon trying to fly for the first time. He's flapping his wings enthusiastically but comically failing, surrounded by giggling cloud creatures. Style: Expressive, funny, and heartwarming.",
      "ContentText": "Sparky wanted to fly, but his little wings just wouldn't work! He tumbled and wobbled, making the cloud creatures giggle."
    },
    {
      "imagePrompt": "Cartoon illustration of a wise old owl perched on a large, glowing mushroom, giving Sparky advice. The owl has spectacles and a kind expression. The background is a magical forest with sparkling fireflies. Style: Enchanting, detailed, and comforting.",
      "ContentText": "A wise old owl saw Sparky's struggle and hooted, 'Little one, flying takes practice and believing in yourself!'"
    },
    {
      "imagePrompt": "Cartoon scene of Sparky taking a deep breath and soaring gracefully through the sky. He's smiling, and the wind is blowing through his purple scales. The background is a panoramic view of rolling green hills and a sparkling blue ocean. Style: Uplifting, adventurous, and joyful.",
      "ContentText": "Sparky took a deep breath, believed in himself, and soared into the sky! He flew over hills and oceans, happy as could be."
    },
    {
      "imagePrompt": "Cartoon illustration of Sparky the purple dragon surrounded by his new friends, the cloud creatures, all laughing and playing together in the sky. The sun is setting, casting a warm golden glow. Style: Heartwarming, friendly, and peaceful.",
      "ContentText": "From that day on, Sparky and his friends played together in the sky, proving that anything is possible if you believe!"
    }
  ]
}

export const RemotionRoot = () => {
  const captionsMs = videoData.captions.at(-1)?.end || 0;
  const totalDurationMs = captionsMs;

  const bufferFrames = 10; // Optional: 2s buffer
  const durationInFrames = Math.round((totalDurationMs / 1000) * 30) + bufferFrames;



  return (
    <>
      <Composition
        id="shortVideo"
        component={RemotionVideo}
        durationInFrames={durationInFrames}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          videoData: videoData
        }}
      />
    </>
  );
};