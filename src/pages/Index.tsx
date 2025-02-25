
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import VideoPreview from "@/components/VideoPreview";
import ConversionControls from "@/components/ConversionControls";
import { validateVideoFile, extractFramesFromVideo } from "@/utils/videoUtils";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    const sizeError = validateVideoFile(file);
    if (sizeError) {
      toast({
        title: "File too large",
        description: sizeError,
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
  };

  const handleConvert = async () => {
    if (!videoFile) return;

    setIsConverting(true);
    setProgress(0);

    try {
      const frames = await extractFramesFromVideo(videoFile, (progress) => {
        setProgress(progress);
      });

      // For now, just show a success message when frames are extracted
      toast({
        title: "Conversion complete",
        description: `Successfully extracted ${frames.length} frames`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-2">
            Video to PDF Converter
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-gray-900">
            Transform Your Videos into Professional PDFs
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Convert your notebook video recordings into clean, organized PDF documents in seconds
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {!videoFile ? (
            <FileUpload onFileSelect={handleFileSelect} />
          ) : (
            <div className="p-6 space-y-6">
              <VideoPreview file={videoFile} />
              {isConverting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-gray-500">
                    Processing video... {Math.round(progress)}%
                  </p>
                </div>
              )}
              <ConversionControls
                isConverting={isConverting}
                onConvert={handleConvert}
                onReset={() => {
                  setVideoFile(null);
                  setIsConverting(false);
                  setProgress(0);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
