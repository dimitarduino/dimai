import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import RemotionVideo from '../app/app/_components/RemotionVideo';

const videoData = {
  captions: [
    {
      "text": "Bolt,",
      "start": 160,
      "end": 416,
      "confidence": 0.94025,
      "speaker": null
    },
    {
      "text": "the",
      "start": 416,
      "end": 560,
      "confidence": 0.99858,
      "speaker": null
    },
    {
      "text": "robot",
      "start": 576,
      "end": 1064,
      "confidence": 0.97931,
      "speaker": null
    },
    {
      "text": "woke",
      "start": 1112,
      "end": 1288,
      "confidence": 0.99979,
      "speaker": null
    },
    {
      "text": "up",
      "start": 1304,
      "end": 1432,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "in",
      "start": 1456,
      "end": 1592,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "a",
      "start": 1616,
      "end": 1752,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "sunflower",
      "start": 1776,
      "end": 2344,
      "confidence": 0.99017,
      "speaker": null
    },
    {
      "text": "field.",
      "start": 2392,
      "end": 2840,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "He",
      "start": 2960,
      "end": 3240,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "had",
      "start": 3280,
      "end": 3432,
      "confidence": 0.99988,
      "speaker": null
    },
    {
      "text": "no",
      "start": 3456,
      "end": 3640,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "memory",
      "start": 3680,
      "end": 4024,
      "confidence": 0.99995,
      "speaker": null
    },
    {
      "text": "of",
      "start": 4072,
      "end": 4184,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "how",
      "start": 4192,
      "end": 4360,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "he",
      "start": 4400,
      "end": 4552,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "got",
      "start": 4576,
      "end": 4760,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "there,",
      "start": 4800,
      "end": 5144,
      "confidence": 0.99859,
      "speaker": null
    },
    {
      "text": "only",
      "start": 5232,
      "end": 5480,
      "confidence": 0.99955,
      "speaker": null
    },
    {
      "text": "a",
      "start": 5520,
      "end": 5720,
      "confidence": 0.9999,
      "speaker": null
    },
    {
      "text": "strange",
      "start": 5760,
      "end": 6120,
      "confidence": 0.74313,
      "speaker": null
    },
    {
      "text": "craving",
      "start": 6200,
      "end": 6568,
      "confidence": 0.99827,
      "speaker": null
    },
    {
      "text": "for",
      "start": 6584,
      "end": 6760,
      "confidence": 0.96675,
      "speaker": null
    },
    {
      "text": "oil",
      "start": 6800,
      "end": 7096,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "and",
      "start": 7168,
      "end": 7496,
      "confidence": 0.98602,
      "speaker": null
    },
    {
      "text": "cupcakes.",
      "start": 7568,
      "end": 8616,
      "confidence": 0.98776,
      "speaker": null
    },
    {
      "text": "He",
      "start": 8808,
      "end": 9208,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "stumbled",
      "start": 9264,
      "end": 9656,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "upon",
      "start": 9688,
      "end": 9896,
      "confidence": 0.9958,
      "speaker": null
    },
    {
      "text": "a",
      "start": 9928,
      "end": 10072,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "talking",
      "start": 10096,
      "end": 10504,
      "confidence": 0.99984,
      "speaker": null
    },
    {
      "text": "squirrel",
      "start": 10552,
      "end": 10936,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "in",
      "start": 10968,
      "end": 11112,
      "confidence": 0.99985,
      "speaker": null
    },
    {
      "text": "a",
      "start": 11136,
      "end": 11272,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "top",
      "start": 11296,
      "end": 11528,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "hat.",
      "start": 11584,
      "end": 12008,
      "confidence": 0.99939,
      "speaker": null
    },
    {
      "text": "The",
      "start": 12104,
      "end": 12360,
      "confidence": 0.99859,
      "speaker": null
    },
    {
      "text": "squirrel,",
      "start": 12400,
      "end": 13000,
      "confidence": 0.98396,
      "speaker": null
    },
    {
      "text": "sipping",
      "start": 13080,
      "end": 13496,
      "confidence": 0.99768,
      "speaker": null
    },
    {
      "text": "tea,",
      "start": 13528,
      "end": 13880,
      "confidence": 0.62192,
      "speaker": null
    },
    {
      "text": "grumbled,",
      "start": 13960,
      "end": 14568,
      "confidence": 0.55898,
      "speaker": null
    },
    {
      "text": "cupcakes.",
      "start": 14664,
      "end": 15464,
      "confidence": 0.99316,
      "speaker": null
    },
    {
      "text": "You",
      "start": 15592,
      "end": 15928,
      "confidence": 0.99536,
      "speaker": null
    },
    {
      "text": "want",
      "start": 15984,
      "end": 16200,
      "confidence": 0.99981,
      "speaker": null
    },
    {
      "text": "cupcakes?",
      "start": 16240,
      "end": 16984,
      "confidence": 0.53053,
      "speaker": null
    },
    {
      "text": "Suddenly,",
      "start": 17112,
      "end": 17704,
      "confidence": 0.99858,
      "speaker": null
    },
    {
      "text": "they",
      "start": 17752,
      "end": 17912,
      "confidence": 0.99989,
      "speaker": null
    },
    {
      "text": "were",
      "start": 17936,
      "end": 18072,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "soaring",
      "start": 18096,
      "end": 18536,
      "confidence": 0.72292,
      "speaker": null
    },
    {
      "text": "through",
      "start": 18568,
      "end": 18712,
      "confidence": 0.99906,
      "speaker": null
    },
    {
      "text": "a",
      "start": 18736,
      "end": 18872,
      "confidence": 0.99972,
      "speaker": null
    },
    {
      "text": "candyland",
      "start": 18896,
      "end": 19512,
      "confidence": 0.57718,
      "speaker": null
    },
    {
      "text": "on",
      "start": 19576,
      "end": 19752,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "a",
      "start": 19776,
      "end": 19864,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "giant",
      "start": 19872,
      "end": 20184,
      "confidence": 0.99949,
      "speaker": null
    },
    {
      "text": "ladybug.",
      "start": 20232,
      "end": 21240,
      "confidence": 0.88214,
      "speaker": null
    },
    {
      "text": "The",
      "start": 21400,
      "end": 21720,
      "confidence": 0.99977,
      "speaker": null
    },
    {
      "text": "squirrel,",
      "start": 21760,
      "end": 22360,
      "confidence": 0.96676,
      "speaker": null
    },
    {
      "text": "surprisingly",
      "start": 22440,
      "end": 23096,
      "confidence": 0.99217,
      "speaker": null
    },
    {
      "text": "chipper,",
      "start": 23128,
      "end": 23800,
      "confidence": 0.61994,
      "speaker": null
    },
    {
      "text": "shouted",
      "start": 23880,
      "end": 24344,
      "confidence": 0.99932,
      "speaker": null
    },
    {
      "text": "to",
      "start": 24392,
      "end": 24504,
      "confidence": 0.99951,
      "speaker": null
    },
    {
      "text": "the",
      "start": 24512,
      "end": 24632,
      "confidence": 0.99907,
      "speaker": null
    },
    {
      "text": "cupcake",
      "start": 24656,
      "end": 25224,
      "confidence": 0.59071,
      "speaker": null
    },
    {
      "text": "kingdom.",
      "start": 25272,
      "end": 25990,
      "confidence": 0.997,
      "speaker": null
    },
    {
      "text": "They",
      "start": 26160,
      "end": 26490,
      "confidence": 0.99964,
      "speaker": null
    },
    {
      "text": "arrived",
      "start": 26530,
      "end": 26922,
      "confidence": 0.99291,
      "speaker": null
    },
    {
      "text": "to",
      "start": 26986,
      "end": 27162,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "find",
      "start": 27186,
      "end": 27322,
      "confidence": 0.99998,
      "speaker": null
    },
    {
      "text": "a",
      "start": 27346,
      "end": 27482,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "cupcake",
      "start": 27506,
      "end": 28026,
      "confidence": 0.9239,
      "speaker": null
    },
    {
      "text": "eating",
      "start": 28058,
      "end": 28362,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "monster.",
      "start": 28426,
      "end": 29066,
      "confidence": 0.97347,
      "speaker": null
    },
    {
      "text": "Bolt,",
      "start": 29178,
      "end": 29722,
      "confidence": 0.85468,
      "speaker": null
    },
    {
      "text": "fueled",
      "start": 29786,
      "end": 30154,
      "confidence": 0.99226,
      "speaker": null
    },
    {
      "text": "by",
      "start": 30202,
      "end": 30362,
      "confidence": 0.99999,
      "speaker": null
    },
    {
      "text": "his",
      "start": 30386,
      "end": 30570,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "mysterious",
      "start": 30610,
      "end": 31242,
      "confidence": 0.99963,
      "speaker": null
    },
    {
      "text": "craving,",
      "start": 31306,
      "end": 31818,
      "confidence": 0.95522,
      "speaker": null
    },
    {
      "text": "prepared",
      "start": 31914,
      "end": 32474,
      "confidence": 0.93924,
      "speaker": null
    },
    {
      "text": "for",
      "start": 32522,
      "end": 32874,
      "confidence": 0.73054,
      "speaker": null
    },
    {
      "text": "a",
      "start": 32962,
      "end": 33162,
      "confidence": 0.99719,
      "speaker": null
    },
    {
      "text": "bake",
      "start": 33186,
      "end": 33386,
      "confidence": 0.99922,
      "speaker": null
    },
    {
      "text": "off",
      "start": 33418,
      "end": 33706,
      "confidence": 0.58931,
      "speaker": null
    },
    {
      "text": "battle.",
      "start": 33778,
      "end": 34522,
      "confidence": 0.73107,
      "speaker": null
    },
    {
      "text": "Bolt",
      "start": 34666,
      "end": 35194,
      "confidence": 0.80759,
      "speaker": null
    },
    {
      "text": "offered",
      "start": 35242,
      "end": 35546,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "the",
      "start": 35578,
      "end": 35722,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "monster",
      "start": 35746,
      "end": 36106,
      "confidence": 0.93243,
      "speaker": null
    },
    {
      "text": "a",
      "start": 36138,
      "end": 36330,
      "confidence": 0.77728,
      "speaker": null
    },
    {
      "text": "cupcake.",
      "start": 36370,
      "end": 37018,
      "confidence": 0.75464,
      "speaker": null
    },
    {
      "text": "The",
      "start": 37114,
      "end": 37370,
      "confidence": 0.99992,
      "speaker": null
    },
    {
      "text": "monster",
      "start": 37410,
      "end": 37834,
      "confidence": 0.93988,
      "speaker": null
    },
    {
      "text": "wept",
      "start": 37882,
      "end": 38202,
      "confidence": 0.69243,
      "speaker": null
    },
    {
      "text": "with",
      "start": 38266,
      "end": 38490,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "joy.",
      "start": 38530,
      "end": 39034,
      "confidence": 0.99549,
      "speaker": null
    },
    {
      "text": "It",
      "start": 39162,
      "end": 39402,
      "confidence": 0.99918,
      "speaker": null
    },
    {
      "text": "turns",
      "start": 39426,
      "end": 39786,
      "confidence": 0.99938,
      "speaker": null
    },
    {
      "text": "out",
      "start": 39818,
      "end": 40058,
      "confidence": 0.99996,
      "speaker": null
    },
    {
      "text": "it",
      "start": 40114,
      "end": 40330,
      "confidence": 0.99995,
      "speaker": null
    },
    {
      "text": "just",
      "start": 40370,
      "end": 40570,
      "confidence": 0.99993,
      "speaker": null
    },
    {
      "text": "needed",
      "start": 40610,
      "end": 40906,
      "confidence": 0.9998,
      "speaker": null
    },
    {
      "text": "a",
      "start": 40938,
      "end": 41130,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "friend.",
      "start": 41170,
      "end": 41466,
      "confidence": 0.99994,
      "speaker": null
    },
    {
      "text": "And",
      "start": 41538,
      "end": 41674,
      "confidence": 0.99946,
      "speaker": null
    },
    {
      "text": "a",
      "start": 41682,
      "end": 41898,
      "confidence": 0.81757,
      "speaker": null
    },
    {
      "text": "really",
      "start": 41954,
      "end": 42218,
      "confidence": 0.99986,
      "speaker": null
    },
    {
      "text": "good",
      "start": 42274,
      "end": 42490,
      "confidence": 0.99991,
      "speaker": null
    },
    {
      "text": "cupcake.",
      "start": 42530,
      "end": 43466,
      "confidence": 0.65084,
      "speaker": null
    },
    {
      "text": "Bolt,",
      "start": 43658,
      "end": 44234,
      "confidence": 0.9019,
      "speaker": null
    },
    {
      "text": "the",
      "start": 44282,
      "end": 44442,
      "confidence": 0.99974,
      "speaker": null
    },
    {
      "text": "squirrel",
      "start": 44466,
      "end": 44906,
      "confidence": 0.72525,
      "speaker": null
    },
    {
      "text": "and",
      "start": 44938,
      "end": 45082,
      "confidence": 0.9996,
      "speaker": null
    },
    {
      "text": "the",
      "start": 45106,
      "end": 45242,
      "confidence": 0.99958,
      "speaker": null
    },
    {
      "text": "frosting",
      "start": 45266,
      "end": 45722,
      "confidence": 0.90363,
      "speaker": null
    },
    {
      "text": "fiend",
      "start": 45786,
      "end": 46170,
      "confidence": 0.99986,
      "speaker": null
    },
    {
      "text": "lived",
      "start": 46250,
      "end": 46506,
      "confidence": 0.99986,
      "speaker": null
    },
    {
      "text": "happily",
      "start": 46538,
      "end": 46922,
      "confidence": 0.99997,
      "speaker": null
    },
    {
      "text": "ever",
      "start": 46986,
      "end": 47210,
      "confidence": 0.99976,
      "speaker": null
    },
    {
      "text": "after.",
      "start": 47250,
      "end": 47330,
      "confidence": 0.99945,
      "speaker": null
    }
  ],
  images: [
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745147802278.png?alt=media&token=6cd60b0f-ddaa-4f04-bcdc-b2d2a3700c36",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745147836662.png?alt=media&token=9cb1ab44-1b79-41c1-809e-581c9a791b63",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745147905575.png?alt=media&token=1c224be0-9c1b-47b5-82be-2a05f2f1e5cd",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745147987668.png?alt=media&token=761848fb-b718-4703-8855-207066c302a6",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/hugface_images%2F1745148038552.png?alt=media&token=35985b3f-d908-4264-9350-9bc2303432c1"
  ],
  audio: 'https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F4ae63761-46d1-429b-9e7d-7c0c7bd5f624.mp3?alt=media&token=c3cab9d3-1559-4b47-abd6-1ebacb7b106c',
  script: [
    {
      "imagePrompt": "Cartoon illustration of a quirky robot named Bolt, with mismatched circuits and a perpetually surprised expression, standing in a field of oversized, rainbow-colored sunflowers. The style should be bright, cheerful, and reminiscent of a children's cartoon.",
      "ContentText": "Bolt the robot woke up in a sunflower field. He had no memory of how he got there, only a strange craving for oil and... cupcakes?"
    },
    {
      "imagePrompt": "A cartoon depiction of Bolt nervously approaching a grumpy-looking talking squirrel wearing a tiny top hat. The squirrel is sitting on a giant mushroom, holding a teacup. The setting is a whimsical forest with floating lanterns and singing flowers. Use a style that is both cute and slightly absurd.",
      "ContentText": "He stumbled upon a talking squirrel in a top hat! The squirrel, sipping tea, grumbled, 'Cupcakes? You want *cupcakes*?'"
    },
    {
      "imagePrompt": "Cartoon scene showing Bolt and the squirrel riding a giant ladybug through a candy-coated landscape. There are lollipop trees, gumdrop houses, and a river of chocolate. The scene should be filled with vibrant colors and exaggerated features. The style should be reminiscent of a classic Looney Tunes cartoon.",
      "ContentText": "Suddenly, they were soaring through a candy land on a giant ladybug! The squirrel, surprisingly chipper, shouted, 'To the Cupcake Kingdom!'"
    },
    {
      "imagePrompt": "A cartoon climax with Bolt facing a giant, cupcake-eating monster made of frosting and sprinkles. The squirrel is hiding behind Bolt's leg, trembling. The scene should be dynamic and slightly scary, but still maintain a lighthearted, cartoonish feel. The style should evoke the feeling of a Saturday morning cartoon.",
      "ContentText": "They arrived to find a cupcake-eating monster! Bolt, fueled by his mysterious craving, prepared for... a bake-off battle?!"
    },
    {
      "imagePrompt": "Cartoon resolution with Bolt offering the monster a perfectly baked cupcake. The monster is crying tears of joy. The squirrel is patting Bolt on the back with a proud smile. The scene should be heartwarming and humorous, with a soft color palette. The style should be similar to a Pixar short.",
      "ContentText": "Bolt offered the monster a cupcake. The monster wept with joy! It turns out, it just needed a friend (and a really good cupcake). Bolt, the squirrel and the frosting fiend lived happily ever after."
    }
  ]
}

export const RemotionRoot = () => {
  const captionsMs = videoData.captions.at(-1)?.end || 0;
  const totalDurationMs = captionsMs;

  const bufferFrames = 30; // Optional: 2s buffer
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