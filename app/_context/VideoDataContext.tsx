import { createContext, Dispatch, SetStateAction } from "react";
import {VideoData} from "@/configs/schema"
import { InferSelectModel } from "drizzle-orm";

type VideoDataContextType = {
    videoData: InferSelectModel<typeof VideoData>[]
    setVideoData: Dispatch<SetStateAction<InferSelectModel<typeof VideoData>[]>>
}

export const VideoDataContext = createContext<VideoDataContextType | null>(null);