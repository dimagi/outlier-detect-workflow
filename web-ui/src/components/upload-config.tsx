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
import * as XLSX from 'xlsx';

type CardProps = React.ComponentProps<typeof Card>;

interface FieldOption {
  name: string;
  selected: boolean;
}

export function UploadConfig({ className, ...props }: CardProps) {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileInfo({
        name: file.name,
        size: file.size
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = json[0] as string[];

        const fieldColumnIndex = headers.findIndex(header => header && header.toLowerCase() === 'field');
        
        if (fieldColumnIndex === -1) {
          setError('The file must contain a "Field" column.');
          setFileInfo(null);
          return;
        }

        const fieldColumn = json.slice(1).map((row: any) => row[fieldColumnIndex]);

        const usernameExists = fieldColumn.includes('username');
        const completedTimeExists = fieldColumn.includes('completed_time');

        if (!usernameExists || !completedTimeExists) {
          setError('The "Field" column must contain "username" and "completed_time".');
          setFileInfo(null);
        } else {
          setError(null);
          const filteredFields = fieldColumn.filter(
            (field: string) => field !== 'username' && field !== 'completed_time'
          );
          setFieldOptions(filteredFields.map(field => ({ name: field, selected: false })));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleRemoveFile = () => {
    setFileInfo(null);
    setFieldOptions([]);
    setError(null);
  };

  const handleCheckboxChange = (index: number) => {
    setFieldOptions(prevOptions => {
      const newOptions = [...prevOptions];
      newOptions[index] = {
        ...newOptions[index],
        selected: !newOptions[index].selected
      };
      return newOptions;
    });
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
      <CardContent className="flex mt-4 flex-col">
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
        {fieldOptions.length > 0 && (
          <>
            <h2 className="mt-4 mb-2 text-lg font-semibold">Questions to analyze:</h2>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">Select</th>
                  <th className="border border-gray-200 p-2">Field</th>
                </tr>
              </thead>
              <tbody>
                {fieldOptions.map((option, index) => (
                  <tr key={option.name}>
                    <td className="border border-gray-200 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td className="border border-gray-200 p-2">{option.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
