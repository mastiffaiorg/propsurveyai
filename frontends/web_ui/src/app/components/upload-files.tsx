import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";

export function UploadFiles({ onUpload }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onUpload(acceptedFiles);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      <input {...getInputProps()} />
      <UploadIcon
        className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400"
      />

      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the files here ..."
          : "Drag & drop files here, or click to select files"}
      </p>
      <Button
        className="mt-4 font-semibold"
        variant="outline"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        Select Files
      </Button>
    </div>
  );
}
