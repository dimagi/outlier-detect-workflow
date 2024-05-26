import OutlierDatePicker from "@/components/outlier-date-picker";
import { UploadConfig } from "@/components/upload-config";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-between font-mono text-sm">
        <div className="mb-8">
          <OutlierDatePicker />
        </div>
        <UploadConfig />
      </div>
    </main>
  );
}