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