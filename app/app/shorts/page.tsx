"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import VideosDashboard from "@/app/app/_components/VideosDashboard";
import EmptyState from "@/app/app/_components/EmptyState";
import { toast } from "sonner";
import {
  listMyVideoData,
  getBatchVideoJobStatuses,
} from "@/app/app/_actions/dashboard-data";
import { InferSelectModel } from "drizzle-orm";
import { VideoData } from "@/configs/schema";
import CustomLoading from "../_components/CustomLoading";

function Dashboard() {
  const { user, isLoaded } = useUser() ?? { user: null, isLoaded: false };
  const [userLocal, setUserLocal] = useState(
    user?.primaryEmailAddress?.emailAddress,
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [videos, setVideos] = useState<InferSelectModel<typeof VideoData>[]>([]);
  const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [progressVideos, setProgressVideos] = useState(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("currentVideoJobId");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    if (user) {
      setUserLocal(user?.primaryEmailAddress?.emailAddress);
    }
  }, [user]);

  const loadInitial = useCallback(async () => {
    if (!userLocal) return;
    try {
      const { items, nextCursor: next } = await listMyVideoData({
        limit: 40,
      });
      setVideos(items);
      setLoaded(true);
      setNextCursor(next);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, [userLocal]);

  useEffect(() => {
    void loadInitial();
  }, [userLocal, loadInitial]);

  const deleteFromLocalStorageJobId = (jobid) => {
    const currentJobIdArr = getLocalStorageJobIds().filter((id) => id !== jobid);
    localStorage.setItem("currentVideoJobId", JSON.stringify(currentJobIdArr));
  };

  const getLocalStorageJobIds = () => {
    const raw = localStorage.getItem("currentVideoJobId");
    return raw ? JSON.parse(raw) : [];
  };

  useEffect(() => {
    if (!userLocal) return;
    let cancelled = false;
    let intervalId;

    const tick = async () => {
      if (cancelled || typeof window === "undefined") return;
      const ids = getLocalStorageJobIds();
      setProgressVideos(ids);
      if (ids.length === 0) return;
      try {
        const jobs = await getBatchVideoJobStatuses(ids);
        let terminal = false;
        for (const job of jobs) {
          if (job.status === "failed") {
            toast.error(job.error || "Video generation failed");
            deleteFromLocalStorageJobId(job.jobId);
            terminal = true;
          } else if (job.status === "completed") {
            deleteFromLocalStorageJobId(job.jobId);
            terminal = true;
          }
        }
        const after = getLocalStorageJobIds();
        setProgressVideos(after);
        if (terminal) await loadInitial();
      } catch (error) {
        console.error("Error checking job status:", error);
      }
    };

    void tick();
    intervalId = setInterval(() => void tick(), 5000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [userLocal, loadInitial]);

  if (!isLoaded) return null;

  const loadMore = async () => {
    if (nextCursor == null || loadingMore || !userLocal) return;
    setLoadingMore(true);
    try {
      const { items, nextCursor: next } = await listMyVideoData({
        limit: 40,
        cursor: nextCursor,
      });
      setVideos((prev) => prev ? [...prev, ...items] : prev);
      setNextCursor(next);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="px-10 py-10">
      <div className="justify-between items-center flex">
        <h2 className="font-bold text-2xl text-primary">Generated Shorts</h2>
        {progressVideos.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {progressVideos.length} videos generating
          </span>
        )}
        <Link href="/app/shorts/create" className="cursor-pointer dark:text-white">
          <Button className="cursor-pointer dark:text-white">
            + Create New
          </Button>
        </Link>
      </div>

      {videos.length == 0 ? loaded ? <EmptyState /> : <CustomLoading title="Loading your videos..." loading={true} /> : null}
      {videos.length > 0 && <VideosDashboard videoList={videos} />}
      {nextCursor != null && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            disabled={loadingMore}
            onClick={() => void loadMore()}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
