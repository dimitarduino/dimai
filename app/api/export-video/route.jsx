import {getServices, renderMediaOnCloudrun} from '@remotion/cloudrun/client';
import { NextResponse } from 'next/server';


const services = await getServices({
  region: 'us-east1',
  compatibleOnly: true,
});
 
const serviceName = services[0].serviceName;

export async function POST(req) {
    const {inputProps} = await req.json();
    console.log(inputProps);
    const result = await renderMediaOnCloudrun({
        serviceName,
        region: 'us-east1',
        serveUrl: process.env.GCP_SERVER_URL,
        composition: 'shortVideo',
        inputProps: {},
        codec: 'h264',
      });
       
      if (result.type === 'success') {
        console.log(result.bucketName);
        console.log(result.renderId);
      }

      return NextResponse.json({"result": result?.publicUrl})
    //   return NextResponse.json({result: downloadUrl});
}