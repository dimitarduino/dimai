"use client";
import { useEffect } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

function RemotionVideo({ captions, images, audio, script, setDurationInFrame }) {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const getDurationFrames = () => {
        return captions?.length > 0 ? (captions[captions.length - 1].end / 1000) * fps : 1200;
    };

    useEffect(() => {
        try {
            setDurationInFrame(getDurationFrames());
        } catch (err) {
            
        }
    }, [captions]); // Runs only when captions change

    const totalDurationInFrames = getDurationFrames();
    const imagesDuration = totalDurationInFrames / images?.length;

    const getFrameCaption = () => {
        const currentTime = frame / 30 * 1000;
        const currentCaption = captions.find((word) => currentTime >= word.start && currentTime <= word.end);

        return currentCaption?.text;
    }

    return (
        <AbsoluteFill className="bg-black">
            {images?.map((image, index) => {
                const startTime = index * imagesDuration;
                const duration = getDurationFrames();
                const scale = (index) => interpolate(frame, [startTime, startTime + duration / 2, startTime + duration], index % 2== 0 ? [1, 1.8, 1] : [1.8, 1.2, 1.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                return (
                    <>
                        <Sequence key={index} from={index * imagesDuration} durationInFrames={imagesDuration}>
                            <Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale(index)})` }} />
                        </Sequence>

                        <AbsoluteFill style={{
                            color: "white",
                            justifyContent: "center",
                            bottom: 50,
                            top: undefined,
                            height: 150,
                            textAlign: "center",
                            width: "100%"
                        }}>
                            <h2 className="font-bold text-4xl">{getFrameCaption()}</h2>
                        </AbsoluteFill>
                    </>
                )

            })}
            {audio &&
                <Audio src={audio} />
            }
        </AbsoluteFill>
    );
}

export default RemotionVideo;