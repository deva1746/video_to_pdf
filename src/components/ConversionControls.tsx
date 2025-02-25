
import { Button } from "@/components/ui/button";
import { RotateCw, FileDown, RefreshCw } from "lucide-react";

interface ConversionControlsProps {
  isConverting: boolean;
  onConvert: () => void;
  onReset: () => void;
}

const ConversionControls = ({
  isConverting,
  onConvert,
  onReset,
}: ConversionControlsProps) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
      <Button
        variant="ghost"
        onClick={onReset}
        className="text-gray-500 hover:text-gray-700"
      >
        <RotateCw className="w-4 h-4 mr-2" />
        Start Over
      </Button>
      <div className="space-x-4">
        <Button
          onClick={onConvert}
          disabled={isConverting}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          {isConverting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              Generate PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConversionControls;
