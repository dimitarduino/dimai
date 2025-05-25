import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import RemotionVideo from '../app/app/_components/RemotionVideo';

const videoData = {
  captions: [
    {
      "text": "Aladdin,",
      "start": 160,
      "end": 800,
      "confidence": 0.9996338,
      "speaker": null
    }
  ],
  images: [
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748129011297.png?alt=media&token=72c874f6-5286-491c-ba58-f29f959acce8",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748129025832.png?alt=media&token=c0a4c8ba-8601-4da3-87fa-9d73aa0ba574",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748129350145.png?alt=media&token=5e27bac0-2fb1-40ea-90f8-692b66c44fd3",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748129358184.png?alt=media&token=bf4a0d2d-949d-4751-aa47-1a4531c549b8",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748129365766.png?alt=media&token=121b7ea9-e9b3-43a1-883f-b8af2a702394"
  ],
  audio: 'https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F4702f032-0402-40aa-b0e5-ff360dbef507.mp3?alt=media&token=9a76dc7e-52df-4a13-a3d4-ba6b346c315b',
  script: [
    {
      "imagePrompt": "Cartoon illustration of Aladdin, a young boy with tattered clothes but a mischievous grin, walking through a bustling marketplace in a fictional Middle Eastern city. The market is filled with colorful stalls selling fruits, spices, and fabrics. The style should be bright and cheerful, reminiscent of a classic Disney cartoon.",
      "ContentText": "Aladdin, a street urchin, lived in a bustling city. He spent his days exploring the marketplace, often getting into minor trouble."
    },
    {
      "imagePrompt": "Cartoon scene of a sinister-looking sorcerer with a long, black beard and a pointy hat, approaching Aladdin in a dark alleyway. The sorcerer is holding a jeweled dagger and whispering something to Aladdin, with a sneaky expression on his face. The alley is dimly lit, with shadows adding to the mysterious atmosphere.",
      "ContentText": "One day, a mysterious sorcerer approached Aladdin, promising him riches if he helped retrieve a lamp from a dangerous cave."
    },
    {
      "imagePrompt": "Cartoon illustration of Aladdin inside a vast, treasure-filled cave. He's holding a dusty, old lamp in his hands and looking around in awe at the piles of gold coins, jewels, and ancient artifacts. The cave is lit by glowing gems, creating a magical and adventurous atmosphere.",
      "ContentText": "Inside the cave, Aladdin found the lamp, but the sorcerer betrayed him, sealing him inside."
    },
    {
      "imagePrompt": "Cartoon scene of Aladdin rubbing the magic lamp. A plume of colorful smoke is erupting from the lamp, swirling around Aladdin. His eyes are wide with surprise and wonder as the smoke begins to take shape. Use vibrant colors and dynamic poses to convey the magical moment.",
      "ContentText": "Trapped, Aladdin rubbed the lamp, and a powerful genie emerged, offering to grant him three wishes."
    },
    {
      "imagePrompt": "Cartoon illustration of Aladdin, now dressed in royal clothing, riding a magic carpet through the sky above the city. He's smiling and waving, with a princess sitting behind him. The city below is twinkling with lights, and the sky is filled with stars. The scene should be romantic and adventurous, inspired by Disney animation.",
      "ContentText": "With the genie's help, Aladdin became a prince and won the heart of the princess. They flew away on a magic carpet, ready for new adventures."
    }
  ]
}
const captionsMs = videoData.captions?.at(-1)?.end || 0;
const bufferFrames = 10;
const durationInFrames = Math.round((captionsMs / 1000) * 30) + bufferFrames;

console.log(`eve duration kolku e: `, durationInFrames)

export const RemotionRoot = () => {
  console.log('eve od root')
  console.log(durationInFrames)

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
          videoData: {...videoData },
          durationInFrames: durationInFrames
        }}
      />
    </>
  );
};