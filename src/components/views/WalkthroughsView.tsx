"use client";

import { ArrowLeft, SearchIcon, Play, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { ALL_WALKTHROUGH_VIDEOS } from "@/apollo/queries/support";
import { WalkthroughVideo } from "@/apollo/types";

const walkthroughs = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Tutorials");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<WalkthroughVideo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  interface WalkthroughVideosQueryData {
    walkthroughVideos: WalkthroughVideo[];
  }

  const {
    data: videosData,
    loading: videosLoading,
    error: videosError,
  } = useQuery<WalkthroughVideosQueryData>(ALL_WALKTHROUGH_VIDEOS);

  const handleGoBack = () => {
    router.back();
  };

  const categories = [
    "All Tutorials",
    "Getting Started",
    "Campaign Setup",
    "Analytics",
    "Team & Settings",
  ];

  // Filter videos based on category and search query
  const filteredVideos =
    videosData?.walkthroughVideos?.filter((video: WalkthroughVideo) => {
      const matchesCategory =
        selectedCategory === "All Tutorials" ||
        video.category === selectedCategory;
      const matchesSearch =
        video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }) || [];

  return (
    <section className="bg-white rounded-md p-4">
      <div className="flex gap-2">
        <button onClick={handleGoBack} className="cursor-pointer">
          <ArrowLeft />
        </button>
        <h2 className="text-lg font-semibold">WalkThroughs</h2>
      </div>
      <div className="flex my-3 gap-3">
        <div className="relative md:mt-0 mt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#F9FAFB] md:w-80 w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
            placeholder="Search By Keyword or topic"
          />

          <SearchIcon
            size={16}
            className="absolute top-4 left-3 text-gray-500"
          />
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-sm">
          Search
        </button>
      </div>
      <div className="flex mb-3 text-sm gap-3 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-md p-3 border ${selectedCategory === category
              ? "border-primary bg-primary/10 text-primary"
              : "border-[#E5E5EA] hover:border-primary/50"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
      {videosLoading ? (
        <div className="py-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          Loading walkthrough videos...
        </div>
      ) : videosError ? (
        <div className="py-8 text-center text-red-500">
          Error loading walkthrough videos. Please try again later.
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No videos found for the selected category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video: WalkthroughVideo) => (
            <div
              key={video.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Play className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {/* Play Button Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => {
                    setSelectedVideo(video);
                    setShowVideoModal(true);
                  }}
                >
                  <button className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </button>
                </div>
                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(video.duration / 60)}:
                    {(video.duration % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {video.category}
                  </span>
                  <span>{video.viewCount} views</span>
                </div>
                {video.isFeatured && (
                  <div className="mt-2">
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      <Dialog open={showVideoModal} onOpenChange={() => setShowVideoModal(false)}>
        <DialogContent size="xl" className="">
          <div className="relative">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full bg-black rounded-lg">
              {selectedVideo?.fileUrl && (
                <video
                  key={selectedVideo.fileUrl}
                  src={selectedVideo.fileUrl}
                  className="w-full h-full rounded-lg"
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload"
                  poster={selectedVideo.thumbnailUrl || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedVideo?.name}
              </h2>
              <p className="mt-2 text-gray-600">
                {selectedVideo?.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {selectedVideo?.category}
                </span>
                <span>{selectedVideo?.viewCount} views</span>
                {selectedVideo?.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.floor(selectedVideo.duration / 60)}:
                    {(selectedVideo.duration % 60).toString().padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default walkthroughs;
