
export const extractFramesFromVideo = async (
  videoFile: File,
  framesPerSecond: number = 1
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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const interval = 1 / framesPerSecond;
      let currentTime = 0;

      video.onseeked = () => {
        context.drawImage(video, 0, 0);
        frames.push(canvas.toDataURL("image/jpeg"));

        if (currentTime < video.duration) {
          currentTime += interval;
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

