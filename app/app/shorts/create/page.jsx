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
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [progress, setProgress] = useState({ step: '', percentage: 0 });
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
    classes: "text-white pointer font-extrabold drop-shadow-lg",
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

  // Check for active jobs when user is available
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      checkForActiveJob();
    }
  }, [user])

  const deleteFromLocalStorageJobId = (jobid) => {
    let currentJobIdArr = getLocalStorageJobIds();
    currentJobIdArr = currentJobIdArr.filter(id => id !== jobid);
    localStorage.setItem('currentVideoJobId', JSON.stringify(currentJobIdArr));
  }

  const getLocalStorageJobIds = () => {
    let currentJobIdArr = !!localStorage.getItem('currentVideoJobId') ? JSON.parse(localStorage.getItem('currentVideoJobId')) : [];
    return currentJobIdArr;
  }

  useEffect(() => {
    if (!currentJobId) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await axios.get(`/api/video-job-status?jobId=${currentJobId}`);
        const job = res.data;


        setJobStatus(job.status);
        setProgress(job.progress || { step: '', percentage: 0 });
        setLoading(job.status === 'processing' || job.status === 'pending');

        if (job.status === 'completed') {
          setLoading(false);
          setVideoId(job.result?.videoId);
          setPlayVideo(true);
          // Refresh user details to get updated credits
          // if (user?.primaryEmailAddress?.emailAddress) {
          //   const userRes = await db.select().from(Users).where(eq(Users.email, user.primaryEmailAddress.emailAddress));
          //   if (userRes[0]) {
          //     setUserDetail(userRes[0]);
          //   }
          // }
          clearInterval(intervalId);
          setCurrentJobId(null);
          if (typeof window !== 'undefined') {
            deleteFromLocalStorageJobId(currentJobId);
          }
        } else if (job.status === 'failed') {
          setLoading(false);
          toast.error(job.error || 'Video generation failed');
          clearInterval(intervalId);
          setCurrentJobId(null);
          if (typeof window !== 'undefined') {
            deleteFromLocalStorageJobId(currentJobId);
          }
        }
      } catch (error) {
        console.error('Error checking job status:', error);
      }

      console.log('intervalam');
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [currentJobId]);  // Check for active jobs on page load
  const checkForActiveJob = async () => {
    //treba dase prefrli


    // if (!user?.primaryEmailAddress?.emailAddress) return;

    // try {
    //   if (typeof window === 'undefined') return; // SSR check
    //   const savedJobId = getLocalStorageJobIds();
    //   if (savedJobId[savedJobId.length - 1]) {
    //     const res = await axios.get(`/api/video-job-status?jobId=${savedJobId[savedJobId.length - 1]}`);
    //     const job = res.data;

    //     if (job.status === 'pending' || job.status === 'processing') {
    //       setCurrentJobId(savedJobId[savedJobId.length - 1]);
    //       setJobStatus(job.status);
    //       setProgress(job.progress || { step: '', percentage: 0 });
    //       setLoading(true);
    //     } else {
    //       deleteFromLocalStorageJobId(savedJobId[savedJobId.length - 1]);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error checking active job:', error);
    //   if (savedJobId?.[savedJobId.length - 1]) {
    //     deleteFromLocalStorageJobId(savedJobId[savedJobId.length - 1]);
    //   }
    // }
  }

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

  const onCreateClickHandler = async () => {
    const daliImaPoeni = proveriPoeni(userDetail.credits, 10);

    if (!daliImaPoeni) {
      toast("Insufficient credits! Please recharge to generate a video.");
      return;
    }

    if (currentJobId) {
      toast("A video generation is already in progress. Please wait.");
      return;
    }

    try {
      setLoading(true);
      setPlayVideo(false);
      setVideoId(null);

      const res = await axios.post('/api/generate-video-job', {
        formData: {
          ...formData,
          gender,
          voice: selectedVoice
        },
        userId: user.id,
        email: user.primaryEmailAddress.emailAddress
      });

      const jobId = res.data.jobId;
      setCurrentJobId(jobId);
      setJobStatus('pending');
      setProgress({ step: 'initializing', percentage: 0 });


      if (typeof window !== 'undefined') {
        let currentVideoJobId = getLocalStorageJobIds();
        currentVideoJobId.push(jobId);

        localStorage.setItem('currentVideoJobId', JSON.stringify(currentVideoJobId));
      }

      toast.success('Video generation started!');
    } catch (error) {
      console.error('Error starting video generation:', error);
      toast.error(error.response?.data?.error || 'Failed to start video generation');
      setLoading(false);
    }
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
        {loading && jobStatus && (
          <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="text-sm font-medium mb-2">
              Status: {jobStatus === 'pending' ? 'Initializing...' :
                jobStatus === 'processing' ? 'Generating video...' : jobStatus}
            </p>
            {progress.step && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {progress.step === 'generating_script' && 'Writing script...'}
                  {progress.step === 'generating_audio' && 'Generating audio...'}
                  {progress.step === 'generating_captions' && 'Creating captions...'}
                  {progress.step === 'generating_images' && 'Generating images...'}
                  {progress.step === 'saving' && 'Saving video data...'}
                  {progress.step === 'completed' && 'Complete!'}
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{progress.percentage || 0}%</p>
              </div>
            )}
          </div>
        )}
        <PlayerDialog playVideo={playVideo} videoId={videoId} />
      </div>
    </div>
  )
}

export default CreateNew
