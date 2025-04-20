"use client";
import { useEffect } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

function RemotionVideo({ videoData, setDurationInFrame }) {
    const { captions, images, audio } = videoData;
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
    const imagesDuration = (totalDurationInFrames / images?.length) + 200;

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
                const scale = (index) => interpolate(frame, [startTime, startTime + duration / 2, startTime + duration], index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1.2, 1.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
                return (
                    <>
                        <Sequence key={index} from={index * imagesDuration} durationInFrames={imagesDuration}>
                            <Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale(index)})` }} />
                        </Sequence>

                        <AbsoluteFill style={{
                            color: "yellow",
                            justifyContent: "center",
                            bottom: 50,
                            top: undefined,
                            height: 150,
                            textAlign: "center",
                            width: "100%"
                        }}>
                            <h2 style={{
                                fontSize: 100, // Much larger
                                fontWeight: 'bold',
                                lineHeight: 1.2,
                                textShadow: '0px 0px 15px rgba(0,0,0,0.75)', // Outline effect for readability
                            }}>{getFrameCaption()}</h2>
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