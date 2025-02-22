"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

export default function FileUploader({ onUploadComplete }: { onUploadComplete: (urls: string[]) => void }) {

    const handleUploadComplete = (resp: any) => {
        const urls = resp.map((file: { ufsUrl: string }) => file.ufsUrl);
        onUploadComplete(urls);
        toast.success("Files uploaded successfully!");
    };

    const handleUploadError = (error: any) => {
        toast.error("Upload failed: " + error);
    };

    return (
        <section className="flex flex-col items-center justify-between">
            <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
            />
        </section>
    );
}
