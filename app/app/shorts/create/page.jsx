"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from '../../_components/SelectTopic'
import SelectStyle from '../../_components/SelectStyle';
import SelectDuration from '../../_components/SelectDuration';
import { Button } from '@/ui/button';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CustomLoading from '../../_components/CustomLoading';
import { VideoDataContext } from 'app/_context/VideoDataContext';
import { db } from 'configs/db';
import { useUser } from '@clerk/nextjs';
import { Users, VideoData } from 'configs/schema';
import PlayerDialog from '../../_components/PlayerDialog';
import { UserDetailContext } from 'app/_context/UserDetailContext';
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';
import { iskoristPoeni, proveriPoeni } from 'lib/utils';
import SelectComponent from 'app/app/_components/SelectComponent';
import { Input } from '@/ui/input';
import Captions from 'app/app/_components/Captions';

function CreateNew() {
  const [formData, setFormData] = useState({
    topic: "Random AI Story",
    comment: "video should be go viral, so start the first part of the script with some catchy question."
  });
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [gender, setGender] = useState("");
  const [currentVoices, setCurrentVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState("");
  const [videoScript, setVideoScript] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const { user } = useUser();
  const { videoData, setVideoData } = useContext(VideoDataContext);

  const captionsData = [{
    name: "YOUTUBER",
    classes: "text-yellow-500 pointer font-extrabold drop-shadow-lg uppercase",
    classesCaption: {
      color: '#eab308',
      cursor: 'pointer',
      fontWeight: 800,
      textTransform: 'uppercase',
      filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
    }
  }, {
    name: "Superme",
    classes: "text-pink-500 pointer font-extrabold drop-shadow-lg uppercase",
    classesCaption: {
      color: '#ffffff',
      cursor: 'pointer',
      fontWeight: 700,
      fontStyle: 'italic',
      filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
    }
  }, {
    name: "NEON",
    classes: "text-green-500 pointer font-extrabold drop-shadow-lg uppercase",
    classesCaption: {
      color: '#22c55e',
      cursor: 'pointer',
      fontWeight: 800,
      textTransform: 'uppercase',
      filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
    }
  }, {
    name: "GLITCH",
    classes: "text-red-500 pointer font-extrabold drop-shadow-lg uppercase",
    classesCaption: {
      color: '#ec4899', 
      cursor: 'pointer',
      fontWeight: 800,
      textTransform: 'uppercase',
      filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
    }
  }, {
    name: "FIRE",
    classes: "text-red-600 pointer font-extrabold drop-shadow-lg uppercase",
    classesCaption: {
      color: '#ef4444',
      cursor: 'pointer',
      fontWeight: 800,
      textTransform: 'uppercase',
      filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
    }
  }
];

const naPromenaInput = (ime, vrednost) => {
  if (ime == 'gender') setGender(vrednost);
  if (ime == 'voice') setSelectedVoice(vrednost);
  setFormData(prev => ({
    ...prev,
    [ime]: vrednost
  }));
}

useEffect(() => {
  getVoices();
}, [])

useEffect(() => {
  const cur = voices.filter(v => (v.ssmlGender == gender));
  const current = cur.map(c => c.name);

  try {
    setCurrentVoices(current);
    setGender(cur[0].ssmlGender)
  } catch (e) {
    // Handle error silently
  }
  // setSelectedVoice(cur[0].name);
}, [gender])

const getVoices = async () => {
  const res = await axios.post("/api/getvoices", {
  }).then((res) => {
    let voices = res.data.result;

    setVoices(voices);
    setSelectedVoice(voices[0].name);
    setGender(voices[0].ssmlGender);
  })
}

const getVideoScript = async () => {
  setLoading(true);
  const prompt = `Write a script to generate 60 seconds video on topic: "${formData.topic}" along with AI image prompt in ${formData.style} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, ${formData.comment}. Give me JSON only. Result should be in this style: [{imagePrompt: '', contentText: ''}]`;

  const res = axios.post("/api/get-video-script", {
    prompt
  }).then(async (res) => {
    setVideoScript(res.data.result);
    setVideoData((prev) => ({
      ...prev,
      'videoScript': res.data.result
    }))
    await GenerateAudioFile(res.data.result);
    await GenerateImage(res.data.result);
  })
  // setLoading(false);
}

const GenerateAudioFile = async (videoScriptData) => {
  setLoading(true);
  let script = ``;
  const id = uuidv4();
  videoScriptData.forEach(item => {
    script += item.contentText + " ";
  })

  const res = await axios.post("/api/generate-audio", {
    id,
    text: script,
    gender,
    voice: selectedVoice
  }).then(async (res) => {
    setVideoData((prev) => ({
      ...prev,
      'audioFile': res.data.result
    }))
    setAudioFileUrl(res.data.result);
    await GenerateCaptionVideo(res.data.result);
  })
}


const GenerateCaptionVideo = async (audioUrl) => {
  setLoading(true);
  const res = await axios.post("/api/generate-caption", {
    audioUrl: audioUrl
  }).then(async (res) => {
    setVideoData((prev) => ({
      ...prev,
      'captions': res.data.result
    }))
    setCaptions(res.data.result);
  })
}

const GenerateImage = async (videoScriptData) => {
  // setLoading(true);
  let images = [];

  for (const item of videoScriptData) {
    await axios.post("/api/generate-image", {
      prompt: item.imagePrompt
    }).then(async (res) => {
      images.push(res.data.result);
    })
  }

  setVideoData((prev) => ({
    ...prev,
    'imageList': images
  }))
  setImageList(images);
  setLoading(false);
}

const onCreateClickHandler = () => {
  const daliImaPoeni = proveriPoeni(userDetail.credits, 10);

  if (!daliImaPoeni) {
    toast("Insufficient credits! Please recharge to generate a video.");
    return;
  }

  getVideoScript();
}

const updateUserCredits = async () => {
  const slednoPoeni = await iskoristPoeni({
    momentalnoKrediti: userDetail.credits,
    kolkuMinus: 10,
    email: user.primaryEmailAddress.emailAddress
  });

  setUserDetail(prev => ({
    ...prev,
    "credits": slednoPoeni
  }));

  setVideoData(null);
}

useEffect(() => {
  if (!!videoData) {
    if (Object.keys(videoData).length == 4) {
      saveVideoData(videoData);
    }
  }
}, [videoData])

const saveVideoData = async (videoData) => {
  setLoading(true);
  const result = await db.insert(VideoData).values({
    script: videoData.videoScript,
    audio: videoData.audioFile,
    captionStyle: captionsData.filter(c => c.name == formData.caption)[0].classesCaption,
    captions: videoData.captions,
    images: videoData.imageList,
    createdBy: user.primaryEmailAddress.emailAddress
  }).returning({ id: VideoData.id });

  await updateUserCredits();
  setVideoId(result[0].id);
  setPlayVideo(true);
  setLoading(false);
}

const handleCaptionChange = (caption) => {
  setFormData(prev => ({
    ...prev,
    'caption': caption
  }));
}

return (
  <div className='md:px-20 max-w-7xl mx-auto'>
    <div className='shadow-sm px-10 py-4 flex flex-col gap-7'>
      {/* Select Topic */}
      <h1 className="font-bold text-3xl text-primary ">Create Stunning Shorts with AI</h1>
      <h2>
        Effortlessly generate eye-catching shorts using the power of AI. Upload your video, and let the technology craft a short, high-quality clip with precise edits and enhancements in just a few seconds.
      </h2>
      <SelectTopic onUserSelect={naPromenaInput} />

      <div className="d-flex flex-column">
        <p className='text-gray-500 dark:text-neutral-200'>Additional instructions?</p>
        <Input type="text" placeholder="Comment" name="comment" className={`mt-2`} value={formData.comment} onChange={(event) => naPromenaInput("comment", event.target.value)} />
      </div>
      {/* Select style */}
      <SelectStyle onUserSelect={naPromenaInput} />
      {/* Duration */}


      <SelectComponent optionsAvailable={["MALE", "FEMALE"]} className="w-full" onUserSelect={naPromenaInput} placeholder="Voice Gender" name="gender" description="Select the voice gender for your video" title="Choose Voice Gender" />

      <SelectComponent
        defaultValue={selectedVoice}
        optionsAvailable={currentVoices || []}
        className="w-full"
        onUserSelect={naPromenaInput}
        placeholder="Voice Model"
        name="voice"
        description="Select the voice for your video"
        title="Choose Voice Model"
      />

      <SelectDuration onUserSelect={naPromenaInput} />

      <Captions onCaptionChange={handleCaptionChange} captions={captionsData} />

      {/* Create Button */}
      <Button onClick={onCreateClickHandler} className="p-6 dark:text-white cursor-pointer">Create short AI Video</Button>

      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  </div>
)
}

export default CreateNew
