import React from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';
import RemotionVideo from '../app/app/_components/RemotionVideo';

const videoData = {
  captions: [
    {
      "text": "In",
      "start": 160,
      "end": 280,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "a",
      "start": 280,
      "end": 400,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "small",
      "start": 400,
      "end": 600,
      "confidence": 0.71875,
      "speaker": null
    },
    {
      "text": "Italian",
      "start": 600,
      "end": 1240,
      "confidence": 0.96028644,
      "speaker": null
    },
    {
      "text": "village",
      "start": 1240,
      "end": 1720,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "lived",
      "start": 1720,
      "end": 2080,
      "confidence": 0.95214844,
      "speaker": null
    },
    {
      "text": "Geppetto,",
      "start": 2080,
      "end": 2840,
      "confidence": 0.8961914,
      "speaker": null
    },
    {
      "text": "a",
      "start": 2840,
      "end": 3080,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "lonely",
      "start": 3080,
      "end": 3440,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "woodcarver.",
      "start": 3440,
      "end": 4240,
      "confidence": 0.90351564,
      "speaker": null
    },
    {
      "text": "He",
      "start": 4720,
      "end": 5040,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "dreamed",
      "start": 5040,
      "end": 5440,
      "confidence": 0.96984863,
      "speaker": null
    },
    {
      "text": "of",
      "start": 5440,
      "end": 5560,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "having",
      "start": 5560,
      "end": 5720,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 5720,
      "end": 5920,
      "confidence": 0.8598633,
      "speaker": null
    },
    {
      "text": "son,",
      "start": 5920,
      "end": 6320,
      "confidence": 0.9987793,
      "speaker": null
    },
    {
      "text": "so",
      "start": 6480,
      "end": 6720,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "he",
      "start": 6720,
      "end": 6880,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "carved",
      "start": 6880,
      "end": 7200,
      "confidence": 0.9897461,
      "speaker": null
    },
    {
      "text": "a",
      "start": 7200,
      "end": 7360,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "puppet",
      "start": 7360,
      "end": 7640,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "from",
      "start": 7640,
      "end": 7800,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 7800,
      "end": 8040,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "special",
      "start": 8040,
      "end": 8360,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "piece",
      "start": 8360,
      "end": 8640,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "of",
      "start": 8640,
      "end": 8760,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "wood",
      "start": 8760,
      "end": 9000,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 9000,
      "end": 9200,
      "confidence": 0.98583984,
      "speaker": null
    },
    {
      "text": "named",
      "start": 9200,
      "end": 9440,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "him",
      "start": 9440,
      "end": 9600,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio.",
      "start": 9600,
      "end": 10400,
      "confidence": 0.99990237,
      "speaker": null
    },
    {
      "text": "To",
      "start": 10880,
      "end": 11160,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Geppetto's",
      "start": 11160,
      "end": 12000,
      "confidence": 0.98046875,
      "speaker": null
    },
    {
      "text": "amazement,",
      "start": 12000,
      "end": 12560,
      "confidence": 0.86486816,
      "speaker": null
    },
    {
      "text": "the",
      "start": 12560,
      "end": 12840,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "puppet",
      "start": 12840,
      "end": 13280,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "came",
      "start": 13280,
      "end": 13520,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 13520,
      "end": 13720,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "life.",
      "start": 13720,
      "end": 14000,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 14320,
      "end": 15080,
      "confidence": 0.99970704,
      "speaker": null
    },
    {
      "text": "could",
      "start": 15080,
      "end": 15360,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "walk,",
      "start": 15360,
      "end": 15680,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "talk,",
      "start": 15919,
      "end": 16280,
      "confidence": 0.99902344,
      "speaker": null
    },
    {
      "text": "and",
      "start": 16280,
      "end": 16600,
      "confidence": 0.9526367,
      "speaker": null
    },
    {
      "text": "even",
      "start": 16600,
      "end": 16960,
      "confidence": 0.6513672,
      "speaker": null
    },
    {
      "text": "laugh.",
      "start": 16960,
      "end": 17440,
      "confidence": 0.8741862,
      "speaker": null
    },
    {
      "text": "Geppetto",
      "start": 17600,
      "end": 18480,
      "confidence": 0.9116211,
      "speaker": null
    },
    {
      "text": "was",
      "start": 18480,
      "end": 18680,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "overjoyed",
      "start": 18680,
      "end": 19240,
      "confidence": 0.94421387,
      "speaker": null
    },
    {
      "text": "and",
      "start": 19240,
      "end": 19440,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "felt",
      "start": 19440,
      "end": 19720,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "like",
      "start": 19720,
      "end": 19880,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "his",
      "start": 19880,
      "end": 20080,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "dream",
      "start": 20080,
      "end": 20400,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "had",
      "start": 20400,
      "end": 20680,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "finally",
      "start": 20680,
      "end": 21080,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "come",
      "start": 21080,
      "end": 21280,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "true.",
      "start": 21280,
      "end": 21680,
      "confidence": 0.99975586,
      "speaker": null
    },
    {
      "text": "Geppetto",
      "start": 22080,
      "end": 23000,
      "confidence": 0.8426758,
      "speaker": null
    },
    {
      "text": "wanted",
      "start": 23000,
      "end": 23240,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 23240,
      "end": 23840,
      "confidence": 0.9998047,
      "speaker": null
    },
    {
      "text": "to",
      "start": 23840,
      "end": 24040,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "be",
      "start": 24040,
      "end": 24160,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 24160,
      "end": 24280,
      "confidence": 0.99853516,
      "speaker": null
    },
    {
      "text": "real",
      "start": 24280,
      "end": 24480,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "boy",
      "start": 24480,
      "end": 24720,
      "confidence": 0.99975586,
      "speaker": null
    },
    {
      "text": "and",
      "start": 24720,
      "end": 24880,
      "confidence": 0.73095703,
      "speaker": null
    },
    {
      "text": "sent",
      "start": 24880,
      "end": 25160,
      "confidence": 0.82910156,
      "speaker": null
    },
    {
      "text": "him",
      "start": 25160,
      "end": 25400,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 25400,
      "end": 25560,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "school.",
      "start": 25560,
      "end": 25840,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "But",
      "start": 26580,
      "end": 26740,
      "confidence": 0.9980469,
      "speaker": null
    },
    {
      "text": "on",
      "start": 26740,
      "end": 26940,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "the",
      "start": 26940,
      "end": 27100,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "way,",
      "start": 27100,
      "end": 27380,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 27380,
      "end": 28180,
      "confidence": 0.99970704,
      "speaker": null
    },
    {
      "text": "was",
      "start": 28180,
      "end": 28380,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "tempted",
      "start": 28380,
      "end": 28740,
      "confidence": 0.99869794,
      "speaker": null
    },
    {
      "text": "by",
      "start": 28740,
      "end": 28860,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "the",
      "start": 28860,
      "end": 29020,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "sly",
      "start": 29020,
      "end": 29380,
      "confidence": 0.9680176,
      "speaker": null
    },
    {
      "text": "fox",
      "start": 29380,
      "end": 29740,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 29740,
      "end": 29940,
      "confidence": 0.9980469,
      "speaker": null
    },
    {
      "text": "cat,",
      "start": 29940,
      "end": 30340,
      "confidence": 0.998291,
      "speaker": null
    },
    {
      "text": "who",
      "start": 30420,
      "end": 30740,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "promised",
      "start": 30740,
      "end": 31140,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "him",
      "start": 31140,
      "end": 31380,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "great",
      "start": 31380,
      "end": 31620,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "riches",
      "start": 31620,
      "end": 32020,
      "confidence": 0.8741862,
      "speaker": null
    },
    {
      "text": "if",
      "start": 32020,
      "end": 32220,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "he",
      "start": 32220,
      "end": 32380,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "joined",
      "start": 32380,
      "end": 32660,
      "confidence": 0.99853516,
      "speaker": null
    },
    {
      "text": "them.",
      "start": 32660,
      "end": 32980,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "Pinocchio,",
      "start": 33460,
      "end": 34340,
      "confidence": 0.959668,
      "speaker": null
    },
    {
      "text": "easily",
      "start": 34500,
      "end": 35060,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "persuaded,",
      "start": 35060,
      "end": 35780,
      "confidence": 0.9649658,
      "speaker": null
    },
    {
      "text": "abandoned",
      "start": 35860,
      "end": 36620,
      "confidence": 0.9942627,
      "speaker": null
    },
    {
      "text": "school",
      "start": 36620,
      "end": 36820,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 36820,
      "end": 37060,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "joined",
      "start": 37060,
      "end": 37340,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 37340,
      "end": 37500,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "puppet",
      "start": 37500,
      "end": 37860,
      "confidence": 0.98876953,
      "speaker": null
    },
    {
      "text": "show.",
      "start": 37860,
      "end": 38180,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "He",
      "start": 38740,
      "end": 39060,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "became",
      "start": 39060,
      "end": 39380,
      "confidence": 0.7963867,
      "speaker": null
    },
    {
      "text": "a",
      "start": 39380,
      "end": 39580,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "star,",
      "start": 39580,
      "end": 39860,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "but",
      "start": 39940,
      "end": 40260,
      "confidence": 0.9741211,
      "speaker": null
    },
    {
      "text": "the",
      "start": 40260,
      "end": 40460,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "puppeteer",
      "start": 40460,
      "end": 41060,
      "confidence": 0.9650879,
      "speaker": null
    },
    {
      "text": "held",
      "start": 41060,
      "end": 41260,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "him",
      "start": 41260,
      "end": 41460,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "captive,",
      "start": 41460,
      "end": 42020,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Wanting",
      "start": 42100,
      "end": 42540,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 42540,
      "end": 42700,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "exploit",
      "start": 42700,
      "end": 43140,
      "confidence": 0.92561847,
      "speaker": null
    },
    {
      "text": "his",
      "start": 43140,
      "end": 43380,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "talent.",
      "start": 43380,
      "end": 43860,
      "confidence": 0.99975586,
      "speaker": null
    },
    {
      "text": "The",
      "start": 44340,
      "end": 44660,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "Blue",
      "start": 44660,
      "end": 44980,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Fairy,",
      "start": 44980,
      "end": 45460,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 45460,
      "end": 45660,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "kind",
      "start": 45660,
      "end": 45860,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 45860,
      "end": 46100,
      "confidence": 0.99072266,
      "speaker": null
    },
    {
      "text": "magical",
      "start": 46100,
      "end": 46620,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "being,",
      "start": 46620,
      "end": 46980,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "appeared",
      "start": 47220,
      "end": 47740,
      "confidence": 0.99975586,
      "speaker": null
    },
    {
      "text": "and",
      "start": 47740,
      "end": 47900,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "told",
      "start": 47900,
      "end": 48100,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 48100,
      "end": 48820,
      "confidence": 0.99960935,
      "speaker": null
    },
    {
      "text": "that",
      "start": 48820,
      "end": 49020,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "his",
      "start": 49020,
      "end": 49180,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "nose",
      "start": 49180,
      "end": 49420,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "would",
      "start": 49420,
      "end": 49580,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "grow",
      "start": 49580,
      "end": 49780,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "longer.",
      "start": 49780,
      "end": 50300,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Every",
      "start": 50300,
      "end": 50500,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "time",
      "start": 50500,
      "end": 50740,
      "confidence": 0.99658203,
      "speaker": null
    },
    {
      "text": "he",
      "start": 50740,
      "end": 50940,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "lied,",
      "start": 50940,
      "end": 51300,
      "confidence": 0.7878418,
      "speaker": null
    },
    {
      "text": "Pinocchio's",
      "start": 52030,
      "end": 52830,
      "confidence": 0.999442,
      "speaker": null
    },
    {
      "text": "nose",
      "start": 52830,
      "end": 53070,
      "confidence": 0.98535156,
      "speaker": null
    },
    {
      "text": "grew",
      "start": 53070,
      "end": 53350,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "enormous",
      "start": 53350,
      "end": 53750,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "as",
      "start": 53750,
      "end": 53950,
      "confidence": 0.9526367,
      "speaker": null
    },
    {
      "text": "he",
      "start": 53950,
      "end": 54150,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "tried",
      "start": 54150,
      "end": 54350,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 54350,
      "end": 54470,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "deny",
      "start": 54470,
      "end": 54790,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "his",
      "start": 54790,
      "end": 54990,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "misdeeds.",
      "start": 54990,
      "end": 55710,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 55950,
      "end": 56750,
      "confidence": 0.99960935,
      "speaker": null
    },
    {
      "text": "finally",
      "start": 56750,
      "end": 57190,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "realized",
      "start": 57190,
      "end": 57670,
      "confidence": 0.99853516,
      "speaker": null
    },
    {
      "text": "the",
      "start": 57670,
      "end": 57830,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "error",
      "start": 57830,
      "end": 58150,
      "confidence": 0.9979248,
      "speaker": null
    },
    {
      "text": "of",
      "start": 58150,
      "end": 58270,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "his",
      "start": 58270,
      "end": 58390,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "ways",
      "start": 58390,
      "end": 58670,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 58670,
      "end": 58830,
      "confidence": 0.99658203,
      "speaker": null
    },
    {
      "text": "wanted",
      "start": 58830,
      "end": 59150,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 59150,
      "end": 59270,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "return",
      "start": 59270,
      "end": 59550,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 59550,
      "end": 59790,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Geppetto.",
      "start": 59790,
      "end": 60510,
      "confidence": 0.96669924,
      "speaker": null
    },
    {
      "text": "He",
      "start": 60910,
      "end": 61230,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "learned",
      "start": 61230,
      "end": 61510,
      "confidence": 0.99560547,
      "speaker": null
    },
    {
      "text": "that",
      "start": 61510,
      "end": 61670,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Geppetto",
      "start": 61670,
      "end": 62350,
      "confidence": 0.98955077,
      "speaker": null
    },
    {
      "text": "had",
      "start": 62350,
      "end": 62510,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "been",
      "start": 62510,
      "end": 62630,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "swallowed",
      "start": 62630,
      "end": 63110,
      "confidence": 0.9998779,
      "speaker": null
    },
    {
      "text": "by",
      "start": 63110,
      "end": 63230,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 63230,
      "end": 63350,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "giant",
      "start": 63350,
      "end": 63670,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "whale",
      "start": 63670,
      "end": 64030,
      "confidence": 0.95947266,
      "speaker": null
    },
    {
      "text": "while",
      "start": 64030,
      "end": 64310,
      "confidence": 0.53125,
      "speaker": null
    },
    {
      "text": "searching",
      "start": 64310,
      "end": 64710,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "for",
      "start": 64710,
      "end": 64870,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "him",
      "start": 64870,
      "end": 65070,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "at",
      "start": 65070,
      "end": 65270,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "sea.",
      "start": 65270,
      "end": 65630,
      "confidence": 0.9465332,
      "speaker": null
    },
    {
      "text": "Determined,",
      "start": 66190,
      "end": 66910,
      "confidence": 0.95666504,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 66910,
      "end": 67790,
      "confidence": 0.9998047,
      "speaker": null
    },
    {
      "text": "set",
      "start": 67790,
      "end": 68070,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "out",
      "start": 68070,
      "end": 68230,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "to",
      "start": 68230,
      "end": 68390,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "find",
      "start": 68390,
      "end": 68550,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "his",
      "start": 68550,
      "end": 68790,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "father.",
      "start": 68790,
      "end": 69230,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "After",
      "start": 69470,
      "end": 69830,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "a",
      "start": 69830,
      "end": 70070,
      "confidence": 0.9399414,
      "speaker": null
    },
    {
      "text": "long",
      "start": 70070,
      "end": 70230,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 70230,
      "end": 70430,
      "confidence": 0.9794922,
      "speaker": null
    },
    {
      "text": "perilous",
      "start": 70430,
      "end": 71070,
      "confidence": 0.9842122,
      "speaker": null
    },
    {
      "text": "journey,",
      "start": 71070,
      "end": 71550,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Pinocchio",
      "start": 71550,
      "end": 72310,
      "confidence": 0.9892578,
      "speaker": null
    },
    {
      "text": "found",
      "start": 72310,
      "end": 72510,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "Geppetto",
      "start": 72510,
      "end": 73270,
      "confidence": 0.9986328,
      "speaker": null
    },
    {
      "text": "inside",
      "start": 73270,
      "end": 73550,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "the",
      "start": 73550,
      "end": 73630,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "whale.",
      "start": 73630,
      "end": 74030,
      "confidence": 0.7597656,
      "speaker": null
    },
    {
      "text": "They",
      "start": 74590,
      "end": 74910,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "embraced,",
      "start": 74910,
      "end": 75630,
      "confidence": 0.94836426,
      "speaker": null
    },
    {
      "text": "overjoyed",
      "start": 75710,
      "end": 76470,
      "confidence": 0.9439697,
      "speaker": null
    },
    {
      "text": "to",
      "start": 76470,
      "end": 76590,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "be",
      "start": 76590,
      "end": 76710,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "reunited.",
      "start": 76710,
      "end": 77310,
      "confidence": 0.9998372,
      "speaker": null
    },
    {
      "text": "Together,",
      "start": 77930,
      "end": 78170,
      "confidence": 0.99902344,
      "speaker": null
    },
    {
      "text": "they",
      "start": 78330,
      "end": 78610,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "escaped",
      "start": 78610,
      "end": 79090,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "the",
      "start": 79090,
      "end": 79250,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "whale.",
      "start": 79250,
      "end": 79610,
      "confidence": 0.96362305,
      "speaker": null
    },
    {
      "text": "Pinocchio,",
      "start": 79850,
      "end": 80730,
      "confidence": 0.99990237,
      "speaker": null
    },
    {
      "text": "having",
      "start": 80810,
      "end": 81170,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "learned",
      "start": 81170,
      "end": 81530,
      "confidence": 0.83935547,
      "speaker": null
    },
    {
      "text": "from",
      "start": 81530,
      "end": 81730,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "his",
      "start": 81730,
      "end": 81890,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "mistakes",
      "start": 81890,
      "end": 82330,
      "confidence": 0.98746747,
      "speaker": null
    },
    {
      "text": "and",
      "start": 82330,
      "end": 82570,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "proven",
      "start": 82570,
      "end": 82930,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "his",
      "start": 82930,
      "end": 83130,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "courage",
      "start": 83130,
      "end": 83490,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "and",
      "start": 83490,
      "end": 83730,
      "confidence": 0.99658203,
      "speaker": null
    },
    {
      "text": "love",
      "start": 83730,
      "end": 83970,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "for",
      "start": 83970,
      "end": 84170,
      "confidence": 0.91503906,
      "speaker": null
    },
    {
      "text": "his",
      "start": 84170,
      "end": 84410,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "father,",
      "start": 84410,
      "end": 84810,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "finally",
      "start": 85050,
      "end": 85570,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "became",
      "start": 85570,
      "end": 85890,
      "confidence": 0.99975586,
      "speaker": null
    },
    {
      "text": "a",
      "start": 85890,
      "end": 86050,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "real",
      "start": 86050,
      "end": 86290,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "boy.",
      "start": 86290,
      "end": 86730,
      "confidence": 0.99853516,
      "speaker": null
    },
    {
      "text": "He",
      "start": 87130,
      "end": 87410,
      "confidence": 0.99853516,
      "speaker": null
    },
    {
      "text": "and",
      "start": 87410,
      "end": 87570,
      "confidence": 0.79833984,
      "speaker": null
    },
    {
      "text": "Geppetto",
      "start": 87570,
      "end": 88290,
      "confidence": 0.98945314,
      "speaker": null
    },
    {
      "text": "lived",
      "start": 88290,
      "end": 88530,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "happily",
      "start": 88530,
      "end": 88930,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "ever",
      "start": 88930,
      "end": 89250,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "after,",
      "start": 89250,
      "end": 89610,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "working",
      "start": 89850,
      "end": 90250,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "side",
      "start": 90250,
      "end": 90530,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "by",
      "start": 90530,
      "end": 90770,
      "confidence": 0.8173828,
      "speaker": null
    },
    {
      "text": "side",
      "start": 90770,
      "end": 91050,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "in",
      "start": 91050,
      "end": 91250,
      "confidence": 1,
      "speaker": null
    },
    {
      "text": "their",
      "start": 91250,
      "end": 91450,
      "confidence": 0.9995117,
      "speaker": null
    },
    {
      "text": "workshop.",
      "start": 91450,
      "end": 92090,
      "confidence": 0.9998372,
      "speaker": null
    }
  ],
  images: [
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748123869608.png?alt=media&token=aed77f07-05a4-4030-8fbb-5f5766ebc6f9",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748123906665.png?alt=media&token=b559eb5f-42bd-4831-836d-1f477ef6e1a9",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748123933902.png?alt=media&token=ed5396dc-25aa-488c-84eb-5362149d1dcf",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748123958284.png?alt=media&token=a7c7517a-dc5b-4ca3-946a-20e9d32a1078",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748123973705.png?alt=media&token=36d1fe1e-53f6-4d6b-a829-4f47c77cf21c",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748123989784.png?alt=media&token=452d5fc2-04e0-4927-bb52-dd126490f10d",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748124010171.png?alt=media&token=3508d7ec-e817-4535-b2f2-332dc03638de",
    "https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2F1748124026848.png?alt=media&token=7ea9b47c-26ed-4d6d-b4b7-81a8271f0a9e"
  ],
  audio: 'https://firebasestorage.googleapis.com/v0/b/aishort-43df4.firebasestorage.app/o/aishortvideofiles%2Febeee9d7-da88-4a49-8273-d19460666005.mp3?alt=media&token=5cd68174-e1d8-413a-8418-6f05586aa24a',
  script: [
    {
      "imagePrompt": "Cartoon illustration of Geppetto, an elderly woodcarver with a kind face and white beard, working diligently in his workshop. He's surrounded by wood shavings and tools, carefully carving the face of a wooden puppet from a log. The workshop is cozy and filled with toys he's made in the past.",
      "ContentText": "In a small Italian village, lived Geppetto, a lonely woodcarver. He dreamed of having a son, so he carved a puppet from a special piece of wood and named him Pinocchio."
    },
    {
      "imagePrompt": "Cartoon depiction of Pinocchio, as a newly carved wooden puppet, coming to life. He's standing on Geppetto's workbench, eyes wide with wonder. Geppetto is smiling at him, his face filled with joy and surprise. The scene is bright and magical, with sparkles of light surrounding Pinocchio.",
      "ContentText": "To Geppetto's amazement, the puppet came to life! Pinocchio could walk, talk, and even laugh. Geppetto was overjoyed and felt like his dream had finally come true."
    },
    {
      "imagePrompt": "Cartoon scene of Pinocchio skipping merrily along a cobblestone road on his way to school. He's wearing a simple outfit and carrying a schoolbook. In the background, a sly fox and a cunning cat are watching him from behind a tree, plotting something mischievous.",
      "ContentText": "Geppetto wanted Pinocchio to be a real boy and sent him to school. But on the way, Pinocchio was tempted by the sly Fox and Cat, who promised him great riches if he joined them."
    },
    {
      "imagePrompt": "Cartoon illustration of Pinocchio performing in a puppet show, surrounded by a cheering crowd. He's dancing and singing on a brightly lit stage, wearing a colorful costume. The puppeteer, a large and intimidating figure, is watching him closely with a greedy expression.",
      "ContentText": "Pinocchio, easily persuaded, abandoned school and joined a puppet show. He became a star, but the puppeteer held him captive, wanting to exploit his talent."
    },
    {
      "imagePrompt": "Cartoon image of Pinocchio's nose growing longer and longer as he tells a lie. He's looking ashamed and embarrassed, with his nose poking through the roof of a small house. The Blue Fairy is watching him from above with a disappointed expression.",
      "ContentText": "The Blue Fairy, a kind and magical being, appeared and told Pinocchio that his nose would grow longer every time he lied. Pinocchio's nose grew enormous as he tried to deny his misdeeds."
    },
    {
      "imagePrompt": "Cartoon scene of Pinocchio searching desperately for Geppetto, who has been swallowed by a giant whale. Pinocchio is standing on a beach, shouting his father's name, with the massive whale looming in the background. The ocean is stormy and the atmosphere is filled with anxiety.",
      "ContentText": "Pinocchio finally realized the error of his ways and wanted to return to Geppetto. He learned that Geppetto had been swallowed by a giant whale while searching for him at sea. Determined, Pinocchio set out to find his father."
    },
    {
      "imagePrompt": "Cartoon depiction of Pinocchio finding Geppetto inside the belly of the whale. They are hugging each other tightly, filled with joy and relief. The inside of the whale is surprisingly cozy, with lanterns providing light.",
      "ContentText": "After a long and perilous journey, Pinocchio found Geppetto inside the whale. They embraced, overjoyed to be reunited."
    },
    {
      "imagePrompt": "Cartoon illustration of Pinocchio working hard alongside Geppetto. He's diligently sawing wood and helping with other tasks in the workshop. He is no longer a puppet but a real boy, smiling happily. The workshop is filled with love and warmth.",
      "ContentText": "Together, they escaped the whale. Pinocchio, having learned from his mistakes and proven his courage and love for his father, finally became a real boy. He and Geppetto lived happily ever after, working side-by-side in their workshop."
    }
  ]
}

export const RemotionRoot = () => {
  const captionsMs = videoData.captions.at(-1)?.end || 0;
  console.log(captionsMs);
  const totalDurationMs = captionsMs;

  const bufferFrames = 10;
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