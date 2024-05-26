"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OutlierDatePicker from "@/components/outlier-date-picker";
import { UploadConfig } from "@/components/upload-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define the form schema using Zod for a date range
const FormSchema = z.object({
  dateRange: z.object({
    from: z.date().nullable(),
    to: z.date().nullable(),
  }).nullable(),
  file: z.any().nullable(),
  fields: z.array(z.string()).nullable(),
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
    },
  });

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
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Date Picker</CardTitle>
                <CardDescription>Select the date range for the analysis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <OutlierDatePicker />
              </CardContent>
            </Card>
            <UploadConfig />
            <Button type="submit">Save Dates</Button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
