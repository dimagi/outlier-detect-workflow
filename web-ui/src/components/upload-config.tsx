"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileSpreadsheet, X } from "lucide-react";

type CardProps = React.ComponentProps<typeof Card>;

export function UploadConfig({ className, ...props }: CardProps) {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileInfo({
        name: file.name,
        size: file.size
      });
    }
  }, []);

  const handleRemoveFile = () => {
    setFileInfo(null);
  };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    onDragEnter: () => {
      // Handle drag enter event
    },
    onDragLeave: () => {
      // Handle drag leave event
    },
    onDragOver: () => {
      // Handle drag over event
    },
    multiple: false,
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Upload Config</CardTitle>
        <CardDescription>Upload your data export config XLSX.</CardDescription>
      </CardHeader>
      <CardContent className="flex mt-4">
        {fileInfo ? (
          <div className="flex items-center space-x-4">
            <FileSpreadsheet className="h-6 w-6" />
            <p>{fileInfo.name}</p>
            <p>{(fileInfo.size / 1024).toFixed(2)} kB</p>
            <button onClick={handleRemoveFile} className="ml-auto">
              <X className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div 
            {...getRootProps()}
            className="flex-1 items-center justify-center space-x-4 rounded-md border p-4 cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop XLSX config, or click to select the file</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
