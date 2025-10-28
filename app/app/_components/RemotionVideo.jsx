"use client";
import { color } from "framer-motion";
import React, { useEffect } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

function RemotionVideo({ videoData, setDurationInFrame, durationInFrames: propDurationInFrames }) {
    const { captions, images, audio, captionStyle } = videoData;
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    // Use the duration passed from props, or calculate it if not provided
    const getDurationFrames = () => {
        if (propDurationInFrames) return propDurationInFrames;
        if (!captions?.length) return 1200;
        const lastCaptionEnd = captions[captions.length - 1].end;
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
        const currentTime = frame / fps * 1000;
        const currentCaption = captions?.find((word) => currentTime >= word.start && currentTime <= word.end);
        return currentCaption?.text;
    }

    return (
        <AbsoluteFill className="bg-black">
            {images?.map((image, index) => {
                const startTime = index * imagesDuration;
                const scale = (index) => interpolate(
                    frame, 
                    [startTime, startTime + imagesDuration / 2, startTime + imagesDuration], 
                    index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1.2, 1.8], 
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );
                return (
                    <React.Fragment key={index}>
                        <Sequence from={startTime} durationInFrames={imagesDuration}>
                            <Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale(index)})` }} />
                        </Sequence>

                        <AbsoluteFill className={`text-white text-3xl`} style={{
                            justifyContent: "center",
                            bottom: 300,
                            top: undefined,
                            height: 150,
                            textAlign: "center",
                            width: "100%"
                        }}>
                            <h2 style={
                                {color: "white"}
                            } 
                             className={`text-white text-3xl`}>{getFrameCaption()}</h2>
                        </AbsoluteFill>
                    </React.Fragment>
                )
            })}
            {audio && <Audio src={audio} />}
        </AbsoluteFill>
    );
}

export default RemotionVideo;