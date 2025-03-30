import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import RemotionVideo from '../app/app/_components/RemotionVideo';
 
const videoData = {
  captions: [
    {
      "text": "The",
      "start": 160,
      "end": 272,
      "confidence": 0.99957,
      "speaker": null
    },
    {
      "text": "climb",
      "start": 272,
      "end": 552,
      "confidence": 0.9873,
      "speaker": null
    },
    {
      "text": "may",
      "start": 568,
      "end": 712,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "be",
      "start": 736,
      "end": 920,
      "confidence": 0.99912,
      "speaker": null
    },
    {
      "text": "tough,",
      "start": 960,
      "end": 1176,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "but",
      "start": 1208,
      "end": 1448,
      "confidence": 0.94658,
      "speaker": null
    },
    {
      "text": "the",
      "start": 1504,
      "end": 1624,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "view",
      "start": 1632,
      "end": 1800,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "from",
      "start": 1840,
      "end": 1992,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "the",
      "start": 2016,
      "end": 2152,
      "confidence": 0.99973,
      "speaker": null
    },
    {
      "text": "top",
      "start": 2176,
      "end": 2408,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "is",
      "start": 2464,
      "end": 2632,
      "confidence": 0.99983,
      "speaker": null
    },
    {
      "text": "worth",
      "start": 2656,
      "end": 2856,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "every",
      "start": 2888,
      "end": 3128,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "step.",
      "start": 3184,
      "end": 3832,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "Even",
      "start": 4016,
      "end": 4360,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "the",
      "start": 4400,
      "end": 4552,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "tallest",
      "start": 4576,
      "end": 4984,
      "confidence": 0.83539,
      "speaker": null
    },
    {
      "text": "tree",
      "start": 5032,
      "end": 5352,
      "confidence": 0.97843,
      "speaker": null
    },
    {
      "text": "started",
      "start": 5416,
      "end": 5688,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "as",
      "start": 5744,
      "end": 5912,
      "confidence": 0.99989,
      "speaker": null
    },
    {
      "text": "a",
      "start": 5936,
      "end": 6072,
      "confidence": 0.99967,
      "speaker": null
    },
    {
      "text": "tiny",
      "start": 6096,
      "end": 6424,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "seed.",
      "start": 6472,
      "end": 6936,
      "confidence": 0.79148,
      "speaker": null
    },
    {
      "text": "Nurture",
      "start": 7048,
      "end": 7416,
      "confidence": 0.71443,
      "speaker": null
    },
    {
      "text": "your",
      "start": 7448,
      "end": 7640,
      "confidence": 0.99391,
      "speaker": null
    },
    {
      "text": "dreams",
      "start": 7680,
      "end": 8024,
      "confidence": 0.63703,
      "speaker": null
    },
    {
      "text": "and",
      "start": 8072,
      "end": 8280,
      "confidence": 0.97685,
      "speaker": null
    },
    {
      "text": "they",
      "start": 8320,
      "end": 8472,
      "confidence": 0.99983,
      "speaker": null
    },
    {
      "text": "will",
      "start": 8496,
      "end": 8680,
      "confidence": 0.9997,
      "speaker": null
    },
    {
      "text": "grow.",
      "start": 8720,
      "end": 9160,
      "confidence": 0.99986,
      "speaker": null
    },
    {
      "text": "The",
      "start": 9280,
      "end": 9512,
      "confidence": 0.99987,
      "speaker": null
    },
    {
      "text": "only",
      "start": 9536,
      "end": 9768,
      "confidence": 0.99976,
      "speaker": null
    },
    {
      "text": "limit",
      "start": 9824,
      "end": 10136,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "is",
      "start": 10168,
      "end": 10312,
      "confidence": 0.99323,
      "speaker": null
    },
    {
      "text": "the",
      "start": 10336,
      "end": 10424,
      "confidence": 0.99966,
      "speaker": null
    },
    {
      "text": "one",
      "start": 10432,
      "end": 10552,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "you",
      "start": 10576,
      "end": 10760,
      "confidence": 0.9997,
      "speaker": null
    },
    {
      "text": "set",
      "start": 10800,
      "end": 11000,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "for",
      "start": 11040,
      "end": 11192,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "yourself.",
      "start": 11216,
      "end": 11832,
      "confidence": 0.99964,
      "speaker": null
    },
    {
      "text": "Push",
      "start": 11976,
      "end": 12344,
      "confidence": 0.99917,
      "speaker": null
    },
    {
      "text": "harder.",
      "start": 12392,
      "end": 12792,
      "confidence": 0.99289,
      "speaker": null
    },
    {
      "text": "You're",
      "start": 12856,
      "end": 13128,
      "confidence": 0.99084,
      "speaker": null
    },
    {
      "text": "almost",
      "start": 13144,
      "end": 13416,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "there.",
      "start": 13488,
      "end": 14056,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "Together,",
      "start": 14208,
      "end": 14664,
      "confidence": 0.99988,
      "speaker": null
    },
    {
      "text": "we",
      "start": 14752,
      "end": 15000,
      "confidence": 0.99988,
      "speaker": null
    },
    {
      "text": "can",
      "start": 15040,
      "end": 15192,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "achieve",
      "start": 15216,
      "end": 15496,
      "confidence": 0.97062,
      "speaker": null
    },
    {
      "text": "what",
      "start": 15528,
      "end": 15720,
      "confidence": 0.99982,
      "speaker": null
    },
    {
      "text": "we",
      "start": 15760,
      "end": 15960,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "never",
      "start": 16000,
      "end": 16200,
      "confidence": 0.99975,
      "speaker": null
    },
    {
      "text": "thought",
      "start": 16240,
      "end": 16440,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "possible.",
      "start": 16480,
      "end": 17064,
      "confidence": 0.99956,
      "speaker": null
    },
    {
      "text": "Collaboration",
      "start": 17232,
      "end": 17992,
      "confidence": 0.53105,
      "speaker": null
    },
    {
      "text": "is",
      "start": 18056,
      "end": 18232,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "the",
      "start": 18256,
      "end": 18392,
      "confidence": 0.9996,
      "speaker": null
    },
    {
      "text": "key",
      "start": 18416,
      "end": 18552,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "to",
      "start": 18576,
      "end": 18712,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "unlocking",
      "start": 18736,
      "end": 19224,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "limitless",
      "start": 19272,
      "end": 19704,
      "confidence": 0.77728,
      "speaker": null
    },
    {
      "text": "potential.",
      "start": 19752,
      "end": 20392,
      "confidence": 0.99954,
      "speaker": null
    },
    {
      "text": "From",
      "start": 20536,
      "end": 20792,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "the",
      "start": 20816,
      "end": 20952,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "ashes",
      "start": 20976,
      "end": 21336,
      "confidence": 0.65132,
      "speaker": null
    },
    {
      "text": "of",
      "start": 21368,
      "end": 21560,
      "confidence": 0.99985,
      "speaker": null
    },
    {
      "text": "failure,",
      "start": 21600,
      "end": 22088,
      "confidence": 0.99958,
      "speaker": null
    },
    {
      "text": "rise",
      "start": 22184,
      "end": 22536,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "stronger",
      "start": 22568,
      "end": 22968,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "and",
      "start": 22984,
      "end": 23160,
      "confidence": 0.96266,
      "speaker": null
    },
    {
      "text": "wiser.",
      "start": 23200,
      "end": 23864,
      "confidence": 0.99955,
      "speaker": null
    },
    {
      "text": "Embrace",
      "start": 23992,
      "end": 24424,
      "confidence": 0.99942,
      "speaker": null
    },
    {
      "text": "the",
      "start": 24472,
      "end": 24632,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "power",
      "start": 24656,
      "end": 24840,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "of",
      "start": 24880,
      "end": 25080,
      "confidence": 0.99981,
      "speaker": null
    },
    {
      "text": "reinvention.",
      "start": 25120,
      "end": 25560,
      "confidence": 0.64621,
      "speaker": null
    }
  ],
  images: [
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1742678807953.png?alt=media&token=8f2cf822-edd2-4b85-b345-402c94aac4b7",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1742678811833.png?alt=media&token=747b2d66-3e5f-47f8-ac13-a8a13672a67a",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1742678814637.png?alt=media&token=d7f63c4c-9be3-4006-809f-1264e2e2c03c",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1742678817200.png?alt=media&token=b628d738-7b7e-4c5c-a8a5-a92afc38713a",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1742678819979.png?alt=media&token=c6adf03e-43ee-496f-86b7-9ac5d2da53e9"
  ],
  audio: 'https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F6554292f-63d6-42a4-884e-a2d671a52f97.mp3?alt=media&token=020aa416-e3f0-46c5-97b4-e9265f1b6a43',
  script: [
    {
      "imagePrompt": "A breathtaking vista of a lone hiker standing on the summit of a snow-capped mountain at sunrise. The sky is ablaze with vibrant oranges, pinks, and purples. The hiker is silhouetted against the light, exuding a sense of accomplishment and freedom. Focus on capturing the grandeur of nature and the hiker's smallness within it. Realistic, high-resolution photography.",
      "ContentText": "The climb may be tough, but the view from the top is worth every step."
    },
    {
      "imagePrompt": "A close-up, high-resolution shot of hands planting a small seedling in fertile soil. Sunlight filters through the leaves of nearby plants, illuminating the hands and the seedling. Focus on the details: the texture of the soil, the delicate nature of the seedling, and the hope for growth. Realistic, warm lighting.",
      "ContentText": "Even the tallest tree started as a tiny seed. Nurture your dreams, and they will grow."
    },
    {
      "imagePrompt": "A realistic depiction of an athlete sprinting towards a finish line, their face etched with determination and sweat. The background is blurred, conveying a sense of speed and focus. Capture the intensity of the moment, the grit and perseverance required to push through. Use dynamic lighting to highlight the athlete's effort.",
      "ContentText": "The only limit is the one you set for yourself. Push harder, you're almost there."
    },
    {
      "imagePrompt": "A diverse group of people working collaboratively on a complex project, surrounded by computers, blueprints, and whiteboards filled with ideas. The atmosphere is energetic and focused. Capture the sense of teamwork and shared purpose, the power of collective intelligence. Realistic, well-lit office environment.",
      "ContentText": "Together, we can achieve what we never thought possible. Collaboration is the key to unlocking limitless potential."
    },
    {
      "imagePrompt": "A phoenix rising from ashes. A realistic, detailed phoenix with fiery feathers, lifting its wings in a triumphant pose. The ashes below are dark and gray, contrasting with the vibrant colors of the phoenix. Emphasize the resilience and power of rebirth. Use dramatic lighting to highlight the phoenix's form.",
      "ContentText": "From the ashes of failure, rise stronger and wiser. Embrace the power of reinvention."
    }
  ]
}

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="shortVideo"
        component={RemotionVideo}
        durationInFrames={Math.round(((videoData?.captions[videoData?.captions.length - 1].end / 1000) * 30)) || 1200}
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