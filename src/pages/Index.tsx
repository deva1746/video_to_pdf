
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import VideoPreview from "@/components/VideoPreview";
import ConversionControls from "@/components/ConversionControls";

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
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
    setVideoFile(file);
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
              <ConversionControls
                isConverting={isConverting}
                onConvert={() => setIsConverting(true)}
                onReset={() => {
                  setVideoFile(null);
                  setIsConverting(false);
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
