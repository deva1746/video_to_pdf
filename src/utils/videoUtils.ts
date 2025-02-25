
const MAX_FILE_SIZE_MB = 100; // 100MB limit
const OPTIMAL_FRAMES_PER_SECOND = 0.5; // One frame every 2 seconds for better performance

export const validateVideoFile = (file: File): string | null => {
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return `File size (${fileSizeMB.toFixed(1)}MB) exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB`;
  }
  return null;
};

export const extractFramesFromVideo = async (
  videoFile: File,
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const frames: string[] = [];
    
    video.src = URL.createObjectURL(videoFile);
    
    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) {
        console.error("Could not get canvas context");
        resolve([]);
        return;
      }

      // Reduce resolution for better performance
      const scale = Math.min(1, 1920 / video.videoWidth); // Max width of 1920px
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;

      const totalFrames = Math.ceil(video.duration * OPTIMAL_FRAMES_PER_SECOND);
      let framesProcessed = 0;
      let currentTime = 0;

      video.onseeked = () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", 0.8)); // Reduced quality for better performance
        framesProcessed++;

        if (onProgress) {
          onProgress((framesProcessed / totalFrames) * 100);
        }

        if (currentTime < video.duration) {
          currentTime += 1 / OPTIMAL_FRAMES_PER_SECOND;
          video.currentTime = currentTime;
        } else {
          URL.revokeObjectURL(video.src);
          resolve(frames);
        }
      };

      video.currentTime = currentTime;
    };
  });
};
