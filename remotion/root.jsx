import React from 'react';
import { Composition } from 'remotion';
import RemotionVideo from '../app/app/_components/RemotionVideo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="shortVideo"
        component={RemotionVideo}
        durationInFrames={30}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          videoData: {
            script: [
              {
                "imagePrompt": "Cartoon style, A curious-looking robot with big, friendly eyes staring at a glowing orb. Sparkles and question marks float around the robot. Bright, inviting colors.",
                "contentText": "Ever wondered what happens when a robot dreams up a wild adventure? Get ready for a story you won't believe!"
              },
              {
                "imagePrompt": "Cartoon style, The same robot now wearing a tiny backpack and standing at the edge of a giant mushroom forest, with oversized, colorful mushrooms. Exaggerated perspective to emphasize the size.",
                "contentText": "Once upon a time, in a land made of rainbow clouds and giggling trees, lived Bolt, the robot who loved telling stories. Bolt decided to explore the Whispering Woods."
              },
              {
                "imagePrompt": "Cartoon style, Bolt, the robot, encountering a group of fluffy, purple sheep wearing tiny glasses and reading books under a giant dandelion. A thought bubble above Bolt shows surprise and joy.",
                "contentText": "Deep inside, he met the Fluffy Scholars – sheep who loved to read! They taught Bolt the ancient language of 'Baa-sic' and shared the secrets of dandelion tea."
              },
              {
                "imagePrompt": "Cartoon style, The Fluffy Scholars and Bolt riding on the back of a giant, friendly snail across a sparkly river made of lemonade. Bubbles float around them.",
                "contentText": "Together, they embarked on a quest to find the legendary Lemonade River, rumored to grant wishes to whoever drinks its bubbly waters."
              },
              {
                "imagePrompt": "Cartoon style, The Fluffy Scholars and Bolt facing a tiny, but grumpy, gnome guarding a bridge made of marshmallows. The gnome is holding a lollipop like a weapon.",
                "contentText": "Their journey wasn't easy! They had to outsmart a grumpy gnome guarding a marshmallow bridge. He demanded a riddle be solved before he'd let them pass."
              },
              {
                "imagePrompt": "Cartoon style, Bolt solving the riddle (represented by a lightbulb appearing above his head) while the Fluffy Scholars cheer. The gnome is begrudgingly handing them lollipops.",
                "contentText": "Bolt, with his super-smart circuits, solved the riddle! The gnome, impressed, gifted them lollipops and allowed them to cross."
              },
              {
                "imagePrompt": "Cartoon style, The Fluffy Scholars and Bolt drinking from the Lemonade River, which is bubbling and sparkling. Wishes are visually represented as stars floating around them.",
                "contentText": "Finally, they reached the Lemonade River! They drank and made a wish: that everyone could have a friend to share adventures with."
              },
              {
                "imagePrompt": "Cartoon style, Bolt back in his starting position, now surrounded by other robots and fluffy sheep, all smiling and ready for new adventures. A sense of community and friendship.",
                "contentText": "And so, Bolt returned home, ready for his next adventure! Share this story and spread the joy of friendship!"
              }
            ],
            audio: "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2Fb5bd43bd-669e-4fc3-8404-d3288899827d.mp3?alt=media&token=966262e2-ecb8-4036-91e2-e906f4391521",
            captions: [
              {
                "text": "Ever",
                "start": 240,
                "end": 400,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "wondered",
                "start": 400,
                "end": 840,
                "confidence": 0.9998372,
                "speaker": null
              },
              {
                "text": "what",
                "start": 840,
                "end": 1000,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "happens",
                "start": 1000,
                "end": 1360,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "when",
                "start": 1360,
                "end": 1520,
                "confidence": 0.7548828,
                "speaker": null
              },
              {
                "text": "a",
                "start": 1520,
                "end": 1720,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "robot",
                "start": 1720,
                "end": 2120,
                "confidence": 0.9913737,
                "speaker": null
              },
              {
                "text": "dreams",
                "start": 2120,
                "end": 2480,
                "confidence": 0.9986572,
                "speaker": null
              },
              {
                "text": "up",
                "start": 2480,
                "end": 2600,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "a",
                "start": 2600,
                "end": 2760,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "wild",
                "start": 2760,
                "end": 3040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "adventure?",
                "start": 3040,
                "end": 3680,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Get",
                "start": 4240,
                "end": 4560,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "ready",
                "start": 4560,
                "end": 4840,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "for",
                "start": 4840,
                "end": 5000,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 5000,
                "end": 5200,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "story",
                "start": 5200,
                "end": 5480,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "you",
                "start": 5480,
                "end": 5760,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "won't",
                "start": 5760,
                "end": 6040,
                "confidence": 0.99853516,
                "speaker": null
              },
              {
                "text": "believe.",
                "start": 6040,
                "end": 6320,
                "confidence": 0.9970703,
                "speaker": null
              },
              {
                "text": "Once",
                "start": 6720,
                "end": 7040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "upon",
                "start": 7040,
                "end": 7400,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 7400,
                "end": 7560,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "time,",
                "start": 7560,
                "end": 7840,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "in",
                "start": 8000,
                "end": 8280,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 8280,
                "end": 8400,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "land",
                "start": 8400,
                "end": 8640,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "made",
                "start": 8640,
                "end": 8920,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "of",
                "start": 8920,
                "end": 9080,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "rainbow",
                "start": 9080,
                "end": 9480,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "clouds",
                "start": 9480,
                "end": 9840,
                "confidence": 0.91031903,
                "speaker": null
              },
              {
                "text": "and",
                "start": 9840,
                "end": 10000,
                "confidence": 0.9243164,
                "speaker": null
              },
              {
                "text": "giggling",
                "start": 10000,
                "end": 10520,
                "confidence": 0.9628906,
                "speaker": null
              },
              {
                "text": "trees",
                "start": 10520,
                "end": 10960,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "lived",
                "start": 11040,
                "end": 11480,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Bolt,",
                "start": 11480,
                "end": 12000,
                "confidence": 0.8901367,
                "speaker": null
              },
              {
                "text": "the",
                "start": 12000,
                "end": 12280,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "robot",
                "start": 12280,
                "end": 12720,
                "confidence": 0.9876302,
                "speaker": null
              },
              {
                "text": "who",
                "start": 12720,
                "end": 12920,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "loved",
                "start": 12920,
                "end": 13240,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "telling",
                "start": 13240,
                "end": 13560,
                "confidence": 0.9790039,
                "speaker": null
              },
              {
                "text": "stories.",
                "start": 13560,
                "end": 14080,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Bolt",
                "start": 14720,
                "end": 15240,
                "confidence": 0.8802083,
                "speaker": null
              },
              {
                "text": "decided",
                "start": 15240,
                "end": 15640,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "to",
                "start": 15640,
                "end": 15840,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "explore",
                "start": 15840,
                "end": 16279,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "the",
                "start": 16279,
                "end": 16440,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Whispering",
                "start": 16440,
                "end": 17040,
                "confidence": 0.93273926,
                "speaker": null
              },
              {
                "text": "Woods.",
                "start": 17040,
                "end": 17520,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Deep",
                "start": 17680,
                "end": 18040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "inside,",
                "start": 18040,
                "end": 18640,
                "confidence": 0.9663086,
                "speaker": null
              },
              {
                "text": "he",
                "start": 18640,
                "end": 18960,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "met",
                "start": 18960,
                "end": 19160,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "the",
                "start": 19160,
                "end": 19320,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "fluffy",
                "start": 19320,
                "end": 19840,
                "confidence": 0.9190674,
                "speaker": null
              },
              {
                "text": "scholars,",
                "start": 19840,
                "end": 20400,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "sheep",
                "start": 20560,
                "end": 21000,
                "confidence": 0.99731445,
                "speaker": null
              },
              {
                "text": "who",
                "start": 21000,
                "end": 21160,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "loved",
                "start": 21160,
                "end": 21480,
                "confidence": 0.9909668,
                "speaker": null
              },
              {
                "text": "to",
                "start": 21480,
                "end": 21640,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "read.",
                "start": 21640,
                "end": 21920,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "They",
                "start": 22400,
                "end": 22720,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "taught",
                "start": 22720,
                "end": 23040,
                "confidence": 0.9996745,
                "speaker": null
              },
              {
                "text": "Bolt",
                "start": 23040,
                "end": 23360,
                "confidence": 0.9938151,
                "speaker": null
              },
              {
                "text": "the",
                "start": 23360,
                "end": 23480,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "ancient",
                "start": 23480,
                "end": 23800,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "language",
                "start": 23800,
                "end": 24240,
                "confidence": 0.99523926,
                "speaker": null
              },
              {
                "text": "of",
                "start": 24240,
                "end": 24440,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "Basic",
                "start": 24440,
                "end": 25200,
                "confidence": 0.4937744,
                "speaker": null
              },
              {
                "text": "and",
                "start": 25360,
                "end": 25680,
                "confidence": 0.99902344,
                "speaker": null
              },
              {
                "text": "shared",
                "start": 25680,
                "end": 26000,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "the",
                "start": 26000,
                "end": 26120,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "secrets",
                "start": 26120,
                "end": 26480,
                "confidence": 0.9992676,
                "speaker": null
              },
              {
                "text": "of",
                "start": 26480,
                "end": 26640,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Dandelion",
                "start": 26640,
                "end": 27320,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "tea.",
                "start": 27320,
                "end": 27840,
                "confidence": 0.9934082,
                "speaker": null
              },
              {
                "text": "Together,",
                "start": 28520,
                "end": 28760,
                "confidence": 0.99853516,
                "speaker": null
              },
              {
                "text": "they",
                "start": 29000,
                "end": 29320,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "embarked",
                "start": 29320,
                "end": 29800,
                "confidence": 0.99401855,
                "speaker": null
              },
              {
                "text": "on",
                "start": 29800,
                "end": 29920,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 29920,
                "end": 30080,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "quest",
                "start": 30080,
                "end": 30360,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "to",
                "start": 30360,
                "end": 30640,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "find",
                "start": 30640,
                "end": 30840,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "the",
                "start": 30840,
                "end": 31040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "legendary",
                "start": 31040,
                "end": 31600,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Lemonade",
                "start": 31600,
                "end": 32280,
                "confidence": 0.9998779,
                "speaker": null
              },
              {
                "text": "river,",
                "start": 32280,
                "end": 32680,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "rumored",
                "start": 32760,
                "end": 33320,
                "confidence": 0.9977214,
                "speaker": null
              },
              {
                "text": "to",
                "start": 33320,
                "end": 33480,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "grant",
                "start": 33480,
                "end": 33720,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "wishes",
                "start": 33720,
                "end": 34160,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "to",
                "start": 34160,
                "end": 34320,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "whoever",
                "start": 34320,
                "end": 34680,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "drinks",
                "start": 34680,
                "end": 35080,
                "confidence": 0.9998372,
                "speaker": null
              },
              {
                "text": "its",
                "start": 35080,
                "end": 35240,
                "confidence": 0.9951172,
                "speaker": null
              },
              {
                "text": "bubbly",
                "start": 35240,
                "end": 35680,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "waters.",
                "start": 35680,
                "end": 36280,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "Their",
                "start": 36760,
                "end": 37120,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "journey",
                "start": 37120,
                "end": 37560,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "wasn't",
                "start": 37560,
                "end": 37960,
                "confidence": 0.9991455,
                "speaker": null
              },
              {
                "text": "easy.",
                "start": 37960,
                "end": 38440,
                "confidence": 0.97753906,
                "speaker": null
              },
              {
                "text": "They",
                "start": 38440,
                "end": 38720,
                "confidence": 0.99902344,
                "speaker": null
              },
              {
                "text": "had",
                "start": 38720,
                "end": 38880,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "to",
                "start": 38880,
                "end": 39040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "outsmart",
                "start": 39040,
                "end": 39600,
                "confidence": 0.93496096,
                "speaker": null
              },
              {
                "text": "a",
                "start": 39600,
                "end": 39720,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "grumpy",
                "start": 39720,
                "end": 40120,
                "confidence": 0.90625,
                "speaker": null
              },
              {
                "text": "gnome",
                "start": 40120,
                "end": 40520,
                "confidence": 0.90771484,
                "speaker": null
              },
              {
                "text": "guarding",
                "start": 40520,
                "end": 40920,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 40920,
                "end": 41040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "marshmallow",
                "start": 41040,
                "end": 41720,
                "confidence": 0.97843426,
                "speaker": null
              },
              {
                "text": "bridge.",
                "start": 41720,
                "end": 42200,
                "confidence": 0.99902344,
                "speaker": null
              },
              {
                "text": "He",
                "start": 42280,
                "end": 42600,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "demanded",
                "start": 42600,
                "end": 43040,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 43040,
                "end": 43200,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "riddle",
                "start": 43200,
                "end": 43600,
                "confidence": 0.8828125,
                "speaker": null
              },
              {
                "text": "be",
                "start": 43600,
                "end": 43760,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "solved",
                "start": 43760,
                "end": 44200,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "before",
                "start": 44200,
                "end": 44480,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "he'd",
                "start": 44480,
                "end": 44800,
                "confidence": 0.9746094,
                "speaker": null
              },
              {
                "text": "let",
                "start": 44800,
                "end": 44960,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "them",
                "start": 44960,
                "end": 45160,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "pass.",
                "start": 45160,
                "end": 45480,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Bolt,",
                "start": 45800,
                "end": 46360,
                "confidence": 0.8489583,
                "speaker": null
              },
              {
                "text": "with",
                "start": 46360,
                "end": 46560,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "his",
                "start": 46560,
                "end": 46800,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "super",
                "start": 46800,
                "end": 47120,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "smart",
                "start": 47120,
                "end": 47560,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "circuits,",
                "start": 47560,
                "end": 48120,
                "confidence": 0.99990237,
                "speaker": null
              },
              {
                "text": "solved",
                "start": 48200,
                "end": 48600,
                "confidence": 0.9086914,
                "speaker": null
              },
              {
                "text": "the",
                "start": 48600,
                "end": 48800,
                "confidence": 0.9951172,
                "speaker": null
              },
              {
                "text": "riddle.",
                "start": 48800,
                "end": 49280,
                "confidence": 0.9959717,
                "speaker": null
              },
              {
                "text": "The",
                "start": 49280,
                "end": 49560,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "gnome,",
                "start": 49560,
                "end": 49960,
                "confidence": 0.9941406,
                "speaker": null
              },
              {
                "text": "impressed,",
                "start": 50120,
                "end": 50880,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "gifted",
                "start": 50880,
                "end": 51320,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "them",
                "start": 51320,
                "end": 51480,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "lollipops",
                "start": 51480,
                "end": 52360,
                "confidence": 0.99853516,
                "speaker": null
              },
              {
                "text": "and",
                "start": 52360,
                "end": 52480,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "allowed",
                "start": 52480,
                "end": 52840,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "them",
                "start": 52840,
                "end": 52960,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "to",
                "start": 52960,
                "end": 53120,
                "confidence": 0.99902344,
                "speaker": null
              },
              {
                "text": "cross.",
                "start": 53120,
                "end": 53480,
                "confidence": 0.98291016,
                "speaker": null
              },
              {
                "text": "Finally,",
                "start": 54490,
                "end": 54890,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "they",
                "start": 54890,
                "end": 55130,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "reached",
                "start": 55130,
                "end": 55490,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "the",
                "start": 55490,
                "end": 55650,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Lemonade",
                "start": 55650,
                "end": 56210,
                "confidence": 0.99523926,
                "speaker": null
              },
              {
                "text": "River.",
                "start": 56210,
                "end": 56650,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "They",
                "start": 56810,
                "end": 57130,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "drank",
                "start": 57130,
                "end": 57410,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "and",
                "start": 57410,
                "end": 57610,
                "confidence": 0.99853516,
                "speaker": null
              },
              {
                "text": "made",
                "start": 57610,
                "end": 57850,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 57850,
                "end": 58050,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "wish",
                "start": 58050,
                "end": 58410,
                "confidence": 0.9812012,
                "speaker": null
              },
              {
                "text": "that",
                "start": 58570,
                "end": 58890,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "everyone",
                "start": 58890,
                "end": 59170,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "could",
                "start": 59170,
                "end": 59450,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "have",
                "start": 59450,
                "end": 59650,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "a",
                "start": 59650,
                "end": 59770,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "friend",
                "start": 59770,
                "end": 59970,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "to",
                "start": 59970,
                "end": 60210,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "share",
                "start": 60210,
                "end": 60410,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "adventures",
                "start": 60410,
                "end": 60970,
                "confidence": 0.9996745,
                "speaker": null
              },
              {
                "text": "with.",
                "start": 60970,
                "end": 61290,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "And",
                "start": 61930,
                "end": 62250,
                "confidence": 0.99902344,
                "speaker": null
              },
              {
                "text": "so",
                "start": 62250,
                "end": 62570,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "Bolt",
                "start": 62570,
                "end": 63130,
                "confidence": 0.83251953,
                "speaker": null
              },
              {
                "text": "returned",
                "start": 63130,
                "end": 63570,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "home,",
                "start": 63570,
                "end": 63850,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "ready",
                "start": 64010,
                "end": 64370,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "for",
                "start": 64370,
                "end": 64530,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "his",
                "start": 64530,
                "end": 64730,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "next",
                "start": 64730,
                "end": 64970,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "adventure.",
                "start": 64970,
                "end": 65610,
                "confidence": 0.97753906,
                "speaker": null
              },
              {
                "text": "Share",
                "start": 66250,
                "end": 66570,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "this",
                "start": 66570,
                "end": 66850,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "story",
                "start": 66850,
                "end": 67170,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "and",
                "start": 67170,
                "end": 67450,
                "confidence": 0.9995117,
                "speaker": null
              },
              {
                "text": "spread",
                "start": 67450,
                "end": 67770,
                "confidence": 0.99975586,
                "speaker": null
              },
              {
                "text": "the",
                "start": 67770,
                "end": 67970,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "joy",
                "start": 67970,
                "end": 68210,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "of",
                "start": 68210,
                "end": 68410,
                "confidence": 1,
                "speaker": null
              },
              {
                "text": "friendship.",
                "start": 68410,
                "end": 68970,
                "confidence": 1,
                "speaker": null
              }
            ],
            images: [
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596358198.png?alt=media&token=f60f187f-1066-4475-ba51-ed86667cca8a",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596365791.png?alt=media&token=bc9c8e51-de08-4af8-b6c6-f8355eefb4d3",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596372372.png?alt=media&token=dbff03ff-1a29-44b2-a81e-99b14cec798b",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596377565.png?alt=media&token=39d79c4f-3c5d-4a63-98c8-e094794fbd6e",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596385344.png?alt=media&token=1e92d603-3b1a-4eed-b68f-997cb5c545b2",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596390636.png?alt=media&token=4c2d83fa-6c07-453e-ac61-3f8e1f449207",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596396528.png?alt=media&token=8fe27afd-ebf0-4665-9538-e5084f2cd084",
              "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1761596401491.png?alt=media&token=6e1cc192-7368-493b-b4ae-e6ae7a375c38"
            ],
            captionStyle: {
              color: '#eab308',
              cursor: 'pointer',
              fontWeight: 800,
              textTransform: 'uppercase',
              filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
            }
          },
          durationInFrames: 30
        }}
        calculateMetadata={({ props }) => {
          const captionsMs = props.videoData?.captions?.at(-1)?.end || 0;
          const bufferFrames = 10;
          const durationInFrames = Math.round((captionsMs / 1000) * 30) + bufferFrames;
          return {
            durationInFrames,
            props: {
              ...props,
              durationInFrames
            }
          };
        }}
      />
    </>
  );
};