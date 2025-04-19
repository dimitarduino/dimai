import { getServices, renderMediaOnCloudrun } from '@remotion/cloudrun/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Fetch services inside the POST function
  const services = await getServices({
    region: 'us-east1',
    compatibleOnly: true,
  });

  const serviceName = services[0]?.serviceName;

  const { inputProps } = await req.json();
  // console.log(inputProps.audio);

  const result = await renderMediaOnCloudrun({
    serviceName,
    region: 'us-east1',
    serveUrl: process.env.GCP_SERVER_URL,
    composition: 'shortVideo',
    inputProps: {
      videoData: inputProps
    },
    codec: 'h264',
  });

  if (result.type === 'success') {
   
  }

  return NextResponse.json({ result: result?.publicUrl });
}