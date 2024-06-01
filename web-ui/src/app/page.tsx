"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OutlierDatePicker from "@/components/outlier-date-picker";
import { UploadConfig } from "@/components/upload-config";
import { Button } from "@/components/ui/button";
import CCHQCredentials from "@/components/cchq-credentials";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FormSchema = z.object({
  dateRange: z.object({
    from: z.date().nullable(),
    to: z.date().nullable(),
  }).nullable(),
  file: z.any().nullable(),
  fields: z.array(z.string()).nullable(),
  ccHqUrl: z.string().min(1),
  ccUser: z.string().min(1),
  ccApiKey: z.string().min(1),
  projectSpace: z.string().min(1),
  ccPassword: z.string().min(1),
  ownerId: z.string().min(1),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: {
        from: null,
        to: null,
      },
      file: null,
      fields: [],
      ccHqUrl: 'https://www.commcarehq.org',
      ccUser: '',
      ccApiKey: '',
      projectSpace: '',
      ccPassword: '',
      ownerId: ''
    },
  });

  const { watch } = form;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("Outlier detection algorithm running.");

  const isFormComplete = () => {
    const values = watch();
    return values.ccUser && values.ccApiKey && values.dateRange?.from && values.dateRange?.to && values.file;
  };

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('dateRange', JSON.stringify(values.dateRange));
    formData.append('ccHqUrl', values.ccHqUrl);
    formData.append('ccUser', values.ccUser);
    formData.append('ccApiKey', values.ccApiKey);
    formData.append('projectSpace', values.projectSpace);
    formData.append('ccPassword', values.ccPassword);
    formData.append('ownerId', values.ownerId);
    formData.append('fields', JSON.stringify(values.fields));

    fetch('/submit', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      setIsDialogOpen(true);
      pollStatus();
    })
    .catch(error => console.error('Error:', error));
  }

  const pollStatus = () => {
    const interval = setInterval(() => {
      fetch('/status')
        .then(response => response.json())
        .then(data => {
          if (data.complete) {
            clearInterval(interval);
            setDialogMessage("Outlier detection complete.");
          }
        })
        .catch(error => console.error('Error:', error));
    }, 1000); // Poll every second
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-between font-mono text-sm">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <CCHQCredentials />
            <OutlierDatePicker />
            <UploadConfig />
            <Button type="submit" disabled={!isFormComplete()}>Run outlier detection</Button>
          </form>
        </FormProvider>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Outlier Detection</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsDialogOpen(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
