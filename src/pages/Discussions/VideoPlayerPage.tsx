import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// Define course videos with YouTube and MP4
const courseVideos: Record<number, { title: string; videoUrl: string; description: string }> = {
    1: {
        title: "Advanced Mathematics",
        videoUrl: "https://youtu.be/xMon4DSzM5s",
        description: "Watch the lecture on Calculus and Integration.",
    },
    2: {
        title: "Computer Science Fundamentals",
        videoUrl: "https://youtu.be/l26oaHV7D40",
        description: "Understanding data structures in depth.",
    },
    3: {
        title: "Physics Laboratory",
        videoUrl: "https://youtu.be/OfBqtyVvzaA",
        description: "Experiment walkthrough and theory.",
    },
};

// Helper function to detect YouTube URLs and convert to embed
const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string): string => {
    let videoId = "";
    if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1];
    } else if (url.includes("youtube.com")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v") || "";
    }
    return `https://www.youtube.com/embed/${videoId}`;
};

const VideoPlayerPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const course = courseVideos[Number(id)];

    if (!course) {
        return (
            <div className="p-8 text-center text-red-600 font-semibold">
                Video not found.
            </div>
        );
    }

    return (
        <div className="px-4 py-6 md:px-8 lg:px-16 space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div className="bg-white rounded-xl shadow border p-6 space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">{course.description}</p>

                <div className="w-full aspect-video rounded-lg overflow-hidden border bg-black">
                    {isYouTubeUrl(course.videoUrl) ? (
                        <iframe
                            className="w-full h-full"
                            src={getYouTubeEmbedUrl(course.videoUrl)}
                            title={course.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            controls
                            className="w-full h-full"
                            poster="https://via.placeholder.com/800x450.png?text=Loading+Video..."
                        >
                            <source src={course.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerPage;
