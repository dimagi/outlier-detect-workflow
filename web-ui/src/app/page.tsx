"use client";

import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OutlierDatePicker from "@/components/outlier-date-picker";
import { UploadConfig } from "@/components/upload-config";
import { Button } from "@/components/ui/button";
import CCHQCredentials from "@/components/cchq-credentials";

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
      ccApiKey: ''
    },
  });

  const { watch } = form;

  const isFormComplete = () => {
    const values = watch();
    return values.ccUser && values.ccApiKey && values.dateRange?.from && values.dateRange?.to && values.file;
  };

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values);
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
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
      </div>
    </main>
  );
}
