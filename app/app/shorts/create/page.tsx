"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from '../../_components/SelectTopic'
import SelectStyle from '../../_components/SelectStyle';
import SelectDuration from '../../_components/SelectDuration';
import { Button } from '@/ui/button';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CustomLoading from '../../_components/CustomLoading';
import { VideoDataContext } from 'app/_context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import PlayerDialog from '../../_components/PlayerDialog';
import { useUserDetail } from '@/app/_context/UserDetailContext';
import { toast } from 'sonner';
import { deductUserCredits, insertShortVideoData } from '@/app/app/_actions/dashboard-data';
import { proveriPoeni, cn } from 'lib/utils';
import SelectComponent from 'app/app/_components/SelectComponent';
import { Input } from '@/ui/input';
import Captions from 'app/app/_components/Captions';
import SelectBackgroundMusic from 'app/app/_components/SelectBackgroundMusic';
import VoicePicker, { type VoicePickerOption } from 'app/app/_components/VoicePicker';
import { resolveShortsBackgroundMusic } from 'lib/shorts-background-music';
import { SHORTS_CURATED_VOICES } from 'lib/shorts-curated-voices';

const SHORTS_VOICE_PICKER_OPTIONS: VoicePickerOption[] = SHORTS_CURATED_VOICES.map((v) => ({
  name: v.name,
  ssmlGender: v.ssmlGender,
  label: v.label,
}));

type ShortsCreateFormData = {
  topic: string;
  comment: string;
  caption: string;
  captionTransition: string;
  backgroundMusicId: string;
  duration: string;
  style: string;
};

const WIZARD_TOTAL_STEPS = 6;

const WIZARD_STEP_LABELS = [
  "Topic & instructions",
  "Style",
  "Audio",
  "Duration",
  "Background music",
  "Captions & transition",
] as const;

/** Aligns with Tailwind `sm` (640px): scroll only on narrow viewports. */
function scrollWizardStepLabelsIntoViewOnMobile() {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(max-width: 639px)").matches) return;
  const el = document.getElementById("wizard-step-labels");
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function CreateNew() {
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState<ShortsCreateFormData>({
    topic: "Random AI Story",
    comment: "video should be go viral, so start the first part of the script with some catchy question.",
    caption: "YOUTUBER",
    captionTransition: "Scale (Zoom)",
    backgroundMusicId: "none",
    duration: "30 seconds",
    style: "",
  });
  const voices = SHORTS_VOICE_PICKER_OPTIONS;
  const [selectedVoice, setSelectedVoice] = useState(
    () => SHORTS_VOICE_PICKER_OPTIONS.find((v) => v.ssmlGender === "MALE")?.name ?? SHORTS_VOICE_PICKER_OPTIONS[0]?.name ?? ""
  );
  const [gender, setGender] = useState(
    () =>
      (SHORTS_VOICE_PICKER_OPTIONS.find((v) => v.ssmlGender === "MALE") ?? SHORTS_VOICE_PICKER_OPTIONS[0])
        ?.ssmlGender ?? "MALE"
  );
  const [loading, setLoading] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>("");
  const [videoScript, setVideoScript] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState({ step: '', percentage: 0 });
  const { userDetail, setUserDetail } = useUserDetail();

  const { user, isLoaded } = useUser();
  const { videoData, setVideoData } = useContext(VideoDataContext) ?? { videoData: null, setVideoData: (videoData: { captions: unknown; id: number; script: unknown; audio: string; captionStyle: unknown; images: string[] | null; createdBy: string; downloadUrl: string; backgroundMusic: string | null; }[]) => {} };

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

  const naPromenaInput = (ime: string, vrednost: string) : void => {
    if (ime == 'gender') setGender(vrednost);
    if (ime == 'voice') setSelectedVoice(vrednost);

    setFormData(prev => ({
      ...prev,
      [ime]: vrednost
    }));
  }

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
    let currentJobIdArr = !!localStorage.getItem('currentVideoJobId') ? JSON.parse(localStorage.getItem('currentVideoJobId') ?? '') : [];
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

  const onCreateClickHandler = async () => {
    const daliImaPoeni = proveriPoeni(userDetail?.credits ?? 0, 10);

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
          voice: selectedVoice,
        },
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress
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
    const slednoPoeni = await deductUserCredits(10);

    setUserDetail(prev => prev ? ({
      ...prev,
      "credits": slednoPoeni
    }) : prev);

    setVideoData([]);
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
    const captionEntry =
      captionsData.find((c) => c.name === formData.caption) ?? captionsData[0];
    const finalCaptionStyle = {
      ...captionEntry.classesCaption,
      transition: formData.captionTransition || "Scale (Zoom)",
    };

    const bgMusic = resolveShortsBackgroundMusic(formData.backgroundMusicId || 'none');

    const result = await insertShortVideoData({
      script: videoData.videoScript,
      audio: videoData.audioFile,
      captionStyle: finalCaptionStyle,
      captions: videoData.captions,
      images: videoData.imageList,
      backgroundMusic: bgMusic.url || null,
    });

    await updateUserCredits();
    setVideoId(result.id);
    setPlayVideo(true);
    setLoading(false);
  }

  const handleCaptionChange = (caption) => {
    setFormData(prev => ({
      ...prev,
      'caption': caption
    }));
  }

  const canGoNextFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(formData.topic?.trim());
      case 2:
        return Boolean(formData.style?.trim());
      case 3: {
        const names = voices.filter((v) => v.ssmlGender === gender).map((v) => v.name);
        return Boolean(gender && selectedVoice && names.includes(selectedVoice));
      }
      case 4:
        return Boolean(formData.duration);
      case 5:
        return true;
      case 6:
        return Boolean(formData.caption);
      default:
        return false;
    }
  }

  const goNext = () => {
    if (!canGoNextFromStep(wizardStep)) {
      if (wizardStep === 1) toast.error("Please choose a topic.");
      if (wizardStep === 2) toast.error("Please select a style.");
      if (wizardStep === 3) toast.error("Pick a voice gender and voice model.");
      if (wizardStep === 4) toast.error("Select a duration.");
      if (wizardStep === 6) toast.error("Pick a caption style.");
      return;
    }
    setWizardStep((s) => Math.min(WIZARD_TOTAL_STEPS, s + 1));
    scrollWizardStepLabelsIntoViewOnMobile();
  }

  const goBack = () => {
    setWizardStep((s) => Math.max(1, s - 1));
  }

  if (!isLoaded) return null;

  const wizardProgressPct = (wizardStep / WIZARD_TOTAL_STEPS) * 100;

  return (
    <div className='md:px-20 max-w-7xl mx-auto'>
      <div className='shadow-sm px-4 sm:px-10 py-6 flex flex-col gap-8'>
        <div>
          <h1 className="font-bold text-3xl text-primary">Create Stunning Shorts with AI</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Walk through each step below. When you are done, generate your short on the last step.
          </p>
        </div>

        {/* Step labels + progress */}
        <div className="space-y-3">
          <div id="wizard-step-labels" className="flex flex-wrap gap-2 sm:gap-1 sm:justify-between">
            {WIZARD_STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const active = wizardStep === n;
              const done = wizardStep > n;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (done || active) setWizardStep(n);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-left transition-colors sm:min-w-0 sm:flex-1",
                    active && "bg-primary/10 ring-2 ring-primary/30",
                    done && "opacity-90 hover:bg-muted/60",
                    !done && !active && "opacity-50 cursor-default"
                  )}
                  disabled={!done && !active}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      done && "bg-primary text-white",
                      active && "bg-primary text-white ring-2 ring-offset-2 ring-primary/40",
                      !done && !active && "bg-muted text-muted-foreground"
                    )}
                  >
                    {n}
                  </span>
                  <span className={cn("sm:max-w-[7.5rem] text-center text-[11px] font-medium leading-tight text-muted-foreground sm:max-w-none sm:text-xs  hidden sm:flex", !active && "hidden max-w-[4rem] sm:max-w-[7.5rem] sm:flex")}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${wizardProgressPct}%` }}
            />
          </div>
          <p className="text-sm font-medium text-foreground">
            Step {wizardStep} of {WIZARD_TOTAL_STEPS}: {WIZARD_STEP_LABELS[wizardStep - 1]}
          </p>
        </div>

        {/* Step panels */}
        <div className="min-h-[220px] rounded-xl border border-border/60 bg-card/30 p-4 sm:p-6">
          {wizardStep === 1 && (
            <div className="flex flex-col gap-6">
              <SelectTopic onUserSelect={naPromenaInput} />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">Additional instructions</p>
                <p className="text-xs text-muted-foreground">Optional hints for the script (tone, hook, audience, etc.)</p>
                <Input
                  type="text"
                  placeholder="e.g. Start with a catchy question…"
                  name="comment"
                  className="mt-1"
                  value={formData.comment}
                  onChange={(event) => naPromenaInput("comment", event.target.value)}
                />
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="flex flex-col gap-2">
              <SelectStyle value={formData.style} onUserSelect={naPromenaInput} />
            </div>
          )}

          {wizardStep === 3 && (
            <VoicePicker
              voices={voices}
              gender={gender}
              selectedVoice={selectedVoice}
              onGenderChange={(g) => naPromenaInput("gender", g)}
              onVoiceSelect={(v) => naPromenaInput("voice", v)}
            />
          )}

          {wizardStep === 4 && (
            <div className="flex flex-col gap-2">
              <SelectDuration value={formData.duration} onUserSelect={naPromenaInput} />
            </div>
          )}

          {wizardStep === 5 && (
            <div className="flex flex-col gap-2">
              <SelectBackgroundMusic
                value={formData.backgroundMusicId}
                onUserSelect={naPromenaInput}
              />
            </div>
          )}

          {wizardStep === 6 && (
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Caption look</p>
                <Captions onCaptionChange={handleCaptionChange} captions={captionsData} />
              </div>
              <SelectComponent
                optionsAvailable={["Scale (Zoom)", "Slide Up", "Fade", "None"]}
                className="w-full"
                onUserSelect={naPromenaInput}
                placeholder="Caption Transition"
                name="captionTransition"
                value={formData.captionTransition}
                description="How captions animate on screen"
                title="Caption transition"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="gap-2 px-8 cursor-pointer py-6 text-base"
            onClick={goBack}
            disabled={wizardStep <= 1 || loading}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          {wizardStep < WIZARD_TOTAL_STEPS ? (
            <Button
              type="button"
              className="gap-2 px-12 cursor-pointer py-6 text-base"
              onClick={goNext}
              disabled={loading || !canGoNextFromStep(wizardStep)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              className="gap-2 px-8 cursor-pointer py-6 text-base"
              onClick={() => void onCreateClickHandler()}
              disabled={loading || !canGoNextFromStep(6)}
            >
              Generate AI short
            </Button>
          )}
        </div>

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
