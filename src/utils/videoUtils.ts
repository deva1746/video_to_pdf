
import { jsPDF } from "jspdf";

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

export const generatePDF = async (frames: string[]): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
  });

  for (let i = 0; i < frames.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const imgData = frames[i];
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = imgData;
    });

    // Calculate dimensions to fit the page while maintaining aspect ratio
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgAspectRatio = img.width / img.height;
    const pageAspectRatio = pageWidth / pageHeight;

    let renderWidth = pageWidth;
    let renderHeight = pageWidth / imgAspectRatio;

    if (renderHeight > pageHeight) {
      renderHeight = pageHeight;
      renderWidth = pageHeight * imgAspectRatio;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    pdf.addImage(imgData, "JPEG", x, y, renderWidth, renderHeight);
  }

  return pdf.output("blob");
};
