import { getFunctions, renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const functions = await getFunctions({
    region: 'us-east-1',
    compatibleOnly: true,
  });

  const functionName = functions[0].functionName;

  const { inputProps } = await req.json();

  // Calculate duration based on the provided videoData
  const captionsMs = inputProps.captions?.at(-1)?.end || 0;
  const bufferFrames = 10;
  const durationInFrames = Math.round((captionsMs / 1000) * 30) + bufferFrames;

  console.log(process.env.AWS_SERVE_URL);
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: 'us-east-1',
    functionName,
    serveUrl: process.env.AWS_SERVE_URL,
    composition: 'shortVideo',
    inputProps: {
      videoData: inputProps,
      durationInFrames: durationInFrames
    },
    codec: 'h264',
    imageFormat: 'jpeg',
    maxRetries: 1,
    framesPerLambda: 30,
    privacy: 'public',
  });

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName,
      region: 'us-east-1',
    });
    if (progress.done) {
      return NextResponse.json({ result: progress.outputFile });
      console.log('Render finished!', progress.outputFile);
      process.exit(0);
    }
    if (progress.fatalErrorEncountered) {
      return NextResponse.json({error: "Error enountered", errors: progress.errors}, {status: 500});
      console.log('error enountered', progress.errors);
      process.exit(1);
    }
  }
}