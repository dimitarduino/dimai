import { getServices, renderMediaOnCloudrun } from '@remotion/cloudrun/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Fetch services inside the POST function
  const services = await getServices({
    region: 'europe-west1',
    compatibleOnly: true,
  });

  const serviceName = services[0]?.serviceName;

  const { inputProps } = await req.json();
  
  // Calculate duration based on the provided videoData
  const captionsMs = inputProps.captions?.at(-1)?.end || 0;
  const bufferFrames = 10;
  const durationInFrames = Math.round((captionsMs / 1000) * 30) + bufferFrames;
  console.log(inputProps.captions?.at(-1).end || 0);
  console.log(durationInFrames);

  const result = await renderMediaOnCloudrun({
    serviceName,
    region: 'europe-west1',
    serveUrl: process.env.GCP_SERVER_URL,
    composition: 'shortVideo',
    inputProps: {
      videoData: inputProps,
      durationInFrames: durationInFrames
    },
    codec: 'h264',
    durationInFrames: durationInFrames,
    maxRetries: 3,
    concurrency: 1,
    framesPerLambda: 1,
  });

  if (result.type === 'success') {
    return NextResponse.json({ result: result?.publicUrl });
  }

  return NextResponse.json({ error: 'Failed to render video' }, { status: 500 });
}