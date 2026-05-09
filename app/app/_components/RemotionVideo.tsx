"use client";

import React, { useEffect } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

export type CaptionWord = {
  start: number;
  end: number;
  text: string;
};

export type RemotionVideoDataShape = {
  captions?: CaptionWord[];
  images?: string[];
  audio?: string;
  captionStyle?: {
    transition?: string;
    [key: string]: unknown;
  };
  backgroundMusic?: string;
  [key: string]: unknown;
};

type RemotionVideoProps = {
  videoData?: RemotionVideoDataShape;
  setDurationInFrame?: (n: number) => void;
  durationInFrames?: number;
};

function RemotionVideo({ videoData, setDurationInFrame, durationInFrames: propDurationInFrames }: RemotionVideoProps) {
  const { captions, images, audio, captionStyle, backgroundMusic } = videoData || {};
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const getDurationFrames = () => {
    if (propDurationInFrames) return propDurationInFrames;
    if (!captions?.length) return 1200;
    const lastCaptionEnd = captions[captions.length - 1]?.end ?? 0;
    return Math.round((lastCaptionEnd / 1000) * fps) + 10;
  };

  useEffect(() => {
    try {
      const duration = getDurationFrames();
      if (setDurationInFrame) {
        setDurationInFrame(duration);
      }
    } catch (err) {
      console.log(`Error: `, err);
    }
  }, [captions, propDurationInFrames]);

  const totalDurationInFrames = getDurationFrames();
  const imagesDuration = Math.floor(totalDurationInFrames / (images?.length || 1));

  const getFrameCaption = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions?.find((word) => currentTime >= word.start && currentTime <= word.end);

    let scale = 1;
    let translateY = 0;
    let opacity = 1;

    if (currentCaption) {
      const razlika = currentCaption.end - currentCaption.start;

      const timePassed = currentTime - currentCaption.start;
      let progress = razlika > 0 ? timePassed / razlika : 0;
      if (progress > 1) progress = 1;

      const transitionStyle = captionStyle?.transition || "Scale (Zoom)";

      if (transitionStyle === "Scale (Zoom)") {
        const delitel25 = razlika / 4;
        const procent = 100 / (razlika / (timePassed + delitel25));
        scale = procent / 100;
        if (scale >= 1) scale = 1;
        if (razlika < 300) scale = 1;
      } else if (transitionStyle === "Slide Up") {
        if (progress < 0.3) {
          translateY = 50 * (1 - progress / 0.3);
          opacity = progress / 0.3;
        } else {
          translateY = 0;
          opacity = 1;
        }
      } else if (transitionStyle === "Fade") {
        if (progress < 0.3) {
          opacity = progress / 0.3;
        } else {
          opacity = 1;
        }
      } else if (transitionStyle === "None") {
        // default values
      }
    } else {
      opacity = 0;
    }

    return {
      text: currentCaption?.text,
      scale,
      translateY,
      opacity,
    };
  };

  const kenBurnsScale = (index: number) =>
    interpolate(
      frame,
      [index * imagesDuration, index * imagesDuration + imagesDuration / 2, index * imagesDuration + imagesDuration],
      index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1.2, 1.8],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <AbsoluteFill className="bg-black">
      {images?.map((image, index) => (
        <React.Fragment key={index}>
          <Sequence from={index * imagesDuration} durationInFrames={imagesDuration}>
            <Img
              src={image}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${kenBurnsScale(index)})`,
              }}
            />
          </Sequence>

          <AbsoluteFill
            style={{
              justifyContent: "center",
              bottom: 300,
              top: undefined,
              height: 150,
              textAlign: "center",
              width: "100%",
            }}
          >
            <h2
              style={{
                ...captionStyle,
                fontSize: 48,
                transform: `scale(${getFrameCaption().scale}) translateY(${getFrameCaption().translateY}px)`,
                opacity: getFrameCaption().opacity,
                fontFamily: "Helvetica, sans-serif",
              }}
              className={`text-white text-3xl`}
            >
              {getFrameCaption().text}
            </h2>
          </AbsoluteFill>
        </React.Fragment>
      ))}
      {audio && <Audio src={audio} />}
      {backgroundMusic && <Audio src={backgroundMusic} loop volume={0.22} />}
    </AbsoluteFill>
  );
}

export default RemotionVideo;
