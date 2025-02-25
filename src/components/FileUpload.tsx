
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "p-12 transition-all duration-300 ease-in-out",
        "border-2 border-dashed rounded-lg cursor-pointer",
        "flex flex-col items-center justify-center gap-4",
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-gray-400 bg-gray-50"
      )}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <Upload className="w-8 h-8 text-gray-400" />
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-gray-900">
          Drop your video here, or click to browse
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Supports MP4, MOV, and AVI formats
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
