
import { useEffect, useRef } from "react";

interface VideoPreviewProps {
  file: File;
}

const VideoPreview = ({ file }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }
    return () => {
      if (videoRef.current?.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [file]);

  return (
    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPreview;
