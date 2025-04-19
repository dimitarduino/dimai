import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import RemotionVideo from '../app/app/_components/RemotionVideo';
 
const videoData = {
  captions: [
    {
      "text": "It",
      "start": 160,
      "end": 272,
      "confidence": 0.9995,
      "speaker": null
    },
    {
      "text": "was",
      "start": 272,
      "end": 408,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "a",
      "start": 416,
      "end": 552,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "dark",
      "start": 576,
      "end": 728,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "and",
      "start": 744,
      "end": 968,
      "confidence": 0.9883,
      "speaker": null
    },
    {
      "text": "stormy",
      "start": 1024,
      "end": 1464,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "night.",
      "start": 1512,
      "end": 1864,
      "confidence": 0.99988,
      "speaker": null
    },
    {
      "text": "They",
      "start": 1952,
      "end": 2200,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "dared",
      "start": 2240,
      "end": 2504,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "me",
      "start": 2552,
      "end": 2664,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "to",
      "start": 2672,
      "end": 2792,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "go",
      "start": 2816,
      "end": 2904,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "into",
      "start": 2912,
      "end": 3128,
      "confidence": 0.80775,
      "speaker": null
    },
    {
      "text": "the",
      "start": 3184,
      "end": 3352,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "abandoned",
      "start": 3376,
      "end": 3816,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "house",
      "start": 3848,
      "end": 4040,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "on",
      "start": 4080,
      "end": 4280,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "Widow's",
      "start": 4320,
      "end": 4728,
      "confidence": 0.96947,
      "speaker": null
    },
    {
      "text": "Hill.",
      "start": 4744,
      "end": 5320,
      "confidence": 0.96483,
      "speaker": null
    },
    {
      "text": "The",
      "start": 5480,
      "end": 5752,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "door",
      "start": 5776,
      "end": 6024,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "groaned",
      "start": 6072,
      "end": 6456,
      "confidence": 0.90961,
      "speaker": null
    },
    {
      "text": "open,",
      "start": 6488,
      "end": 6824,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "revealing",
      "start": 6912,
      "end": 7368,
      "confidence": 0.99508,
      "speaker": null
    },
    {
      "text": "a",
      "start": 7384,
      "end": 7560,
      "confidence": 0.60772,
      "speaker": null
    },
    {
      "text": "long,",
      "start": 7600,
      "end": 7944,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "dark",
      "start": 8032,
      "end": 8296,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "hallway.",
      "start": 8328,
      "end": 8936,
      "confidence": 0.99995,
      "speaker": null
    },
    {
      "text": "Cobwebs",
      "start": 9048,
      "end": 9752,
      "confidence": 0.78936,
      "speaker": null
    },
    {
      "text": "brushed",
      "start": 9816,
      "end": 10136,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "my",
      "start": 10168,
      "end": 10312,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "face",
      "start": 10336,
      "end": 10616,
      "confidence": 0.70582,
      "speaker": null
    },
    {
      "text": "like",
      "start": 10688,
      "end": 10920,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "ghostly",
      "start": 10960,
      "end": 11464,
      "confidence": 0.99982,
      "speaker": null
    },
    {
      "text": "fingers.",
      "start": 11512,
      "end": 12040,
      "confidence": 0.99881,
      "speaker": null
    },
    {
      "text": "I",
      "start": 12120,
      "end": 12360,
      "confidence": 0.9996,
      "speaker": null
    },
    {
      "text": "saw",
      "start": 12400,
      "end": 12552,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "it",
      "start": 12576,
      "end": 12760,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "then.",
      "start": 12800,
      "end": 13192,
      "confidence": 0.90431,
      "speaker": null
    },
    {
      "text": "A",
      "start": 13296,
      "end": 13512,
      "confidence": 0.99747,
      "speaker": null
    },
    {
      "text": "figure",
      "start": 13536,
      "end": 13864,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "standing",
      "start": 13912,
      "end": 14296,
      "confidence": 0.86701,
      "speaker": null
    },
    {
      "text": "at",
      "start": 14328,
      "end": 14424,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "the",
      "start": 14432,
      "end": 14552,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "end",
      "start": 14576,
      "end": 14712,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "of",
      "start": 14736,
      "end": 14824,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "the",
      "start": 14832,
      "end": 14952,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "hall.",
      "start": 14976,
      "end": 15656,
      "confidence": 0.99938,
      "speaker": null
    },
    {
      "text": "Its",
      "start": 15848,
      "end": 16200,
      "confidence": 0.99504,
      "speaker": null
    },
    {
      "text": "eyes",
      "start": 16240,
      "end": 16456,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "glowed",
      "start": 16488,
      "end": 16776,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "red",
      "start": 16808,
      "end": 17000,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "in",
      "start": 17040,
      "end": 17192,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "the",
      "start": 17216,
      "end": 17352,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "darkness.",
      "start": 17376,
      "end": 17976,
      "confidence": 0.99974,
      "speaker": null
    },
    {
      "text": "I",
      "start": 18088,
      "end": 18312,
      "confidence": 0.99972,
      "speaker": null
    },
    {
      "text": "didn't",
      "start": 18336,
      "end": 18616,
      "confidence": 0.99989,
      "speaker": null
    },
    {
      "text": "wait",
      "start": 18648,
      "end": 18808,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "to",
      "start": 18824,
      "end": 18952,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "see",
      "start": 18976,
      "end": 19160,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "more.",
      "start": 19200,
      "end": 19592,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "I",
      "start": 19696,
      "end": 19960,
      "confidence": 0.99982,
      "speaker": null
    },
    {
      "text": "turned",
      "start": 20000,
      "end": 20248,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "and",
      "start": 20264,
      "end": 20440,
      "confidence": 0.99934,
      "speaker": null
    },
    {
      "text": "ran.",
      "start": 20480,
      "end": 20840,
      "confidence": 0.99663,
      "speaker": null
    },
    {
      "text": "The",
      "start": 20920,
      "end": 21112,
      "confidence": 0.99937,
      "speaker": null
    },
    {
      "text": "image",
      "start": 21136,
      "end": 21384,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "seared",
      "start": 21432,
      "end": 21784,
      "confidence": 0.94178,
      "speaker": null
    },
    {
      "text": "into",
      "start": 21832,
      "end": 22040,
      "confidence": 0.99986,
      "speaker": null
    },
    {
      "text": "my",
      "start": 22080,
      "end": 22232,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "mind",
      "start": 22256,
      "end": 22536,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "forever.",
      "start": 22608,
      "end": 23368,
      "confidence": 0.9998,
      "speaker": null
    },
    {
      "text": "Even",
      "start": 23544,
      "end": 24024,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "now,",
      "start": 24112,
      "end": 24456,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "safe",
      "start": 24528,
      "end": 24856,
      "confidence": 0.99979,
      "speaker": null
    },
    {
      "text": "in",
      "start": 24888,
      "end": 25032,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "my",
      "start": 25056,
      "end": 25192,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "bed,",
      "start": 25216,
      "end": 25560,
      "confidence": 0.99989,
      "speaker": null
    },
    {
      "text": "I",
      "start": 25640,
      "end": 25832,
      "confidence": 0.99967,
      "speaker": null
    },
    {
      "text": "can't",
      "start": 25856,
      "end": 26056,
      "confidence": 0.99922,
      "speaker": null
    },
    {
      "text": "shake",
      "start": 26088,
      "end": 26296,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "the",
      "start": 26328,
      "end": 26472,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "feeling",
      "start": 26496,
      "end": 26744,
      "confidence": 0.62243,
      "speaker": null
    },
    {
      "text": "that",
      "start": 26792,
      "end": 26952,
      "confidence": 0.99983,
      "speaker": null
    },
    {
      "text": "I'm",
      "start": 26976,
      "end": 27128,
      "confidence": 0.99911,
      "speaker": null
    },
    {
      "text": "still",
      "start": 27144,
      "end": 27320,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "being",
      "start": 27360,
      "end": 27560,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "watched.",
      "start": 27600,
      "end": 27880,
      "confidence": 0.99989,
      "speaker": null
    }
  ],
  images: [
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1745042184762.png?alt=media&token=656a8572-ba14-48c5-8fb8-b2271c8fedea",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1745042197118.png?alt=media&token=6255cc5c-1c80-4e78-a8eb-9cba17f1aa48",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1745042208248.png?alt=media&token=67d81f5a-72d0-42dd-8bda-a9043131b955",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1745042218836.png?alt=media&token=3a876714-704d-4a9b-82d2-5d0ab5c2f3e7",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1745042230435.png?alt=media&token=8d456775-4a07-4194-97c9-0956019facfc"
  ],
  audio: 'https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2Fb5ed4e25-340b-47c9-8f22-904508d26ac9.mp3?alt=media&token=48dfda4b-0305-4c60-9c6d-36e2db372a42',
  script: [
    {
      "imagePrompt": "Cartoon illustration of a creepy old house on a hill, silhouetted against a full moon. Exaggerate the house's features: crooked windows, gnarled trees, and a general sense of decay. Use a dark, moody color palette with greens and purples.",
      "ContentText": "It was a dark and stormy night. They dared me to go into the abandoned house on Widow's Hill."
    },
    {
      "imagePrompt": "Cartoon depiction of a character cautiously opening a creaky, wooden door inside the house. Use exaggerated shadows to create a sense of suspense. Show the character's wide, scared eyes and trembling hands.",
      "ContentText": "The door groaned open, revealing a long, dark hallway. Cobwebs brushed my face like ghostly fingers."
    },
    {
      "imagePrompt": "Cartoon scene of a shadowy figure lurking at the end of the hallway. Make the figure's features indistinct, focusing on its menacing silhouette. Emphasize the long, spindly fingers and glowing red eyes.",
      "ContentText": "I saw it then... a figure standing at the end of the hall. Its eyes glowed red in the darkness."
    },
    {
      "imagePrompt": "Cartoon illustration of the character running away in terror, their face contorted in a scream. Use blur effects and dynamic lines to convey the speed and intensity of their flight. The creepy house is in the background, looming ominously.",
      "ContentText": "I didn't wait to see more. I turned and ran, the image seared into my mind forever!"
    },
    {
      "imagePrompt": "Cartoon depiction of the character safely back home, huddled under the covers, still terrified. Exaggerate their trembling body and wide, sleepless eyes. The silhouette of the creepy house is visible through the window, reminding them of their ordeal.",
      "ContentText": "Even now, safe in my bed, I can't shake the feeling that I'm still being watched."
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