"use client";

import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsTablet } from "@/hooks/use-tablet";

export default function ImageUploader({ onUploadComplete }: { onUploadComplete: (urls: string[]) => void }) {

    const { state } = useSidebar()
    const isTablet = useIsTablet()

    const handleUploadComplete = (resp: any) => {
        const urls = resp.map((file: { ufsUrl: string }) => file.ufsUrl);
        onUploadComplete(urls);
        toast.success("Files uploaded successfully!");
    };

    const handleUploadError = (error: any) => {
        toast.error("Upload failed: " + error);
    };

    return (
        <div className={`w-full space-y-2 ${state === "expanded" && isTablet ? "-z-10" : "z-0"}`}>
            <Label className="text-base">Upload mages</Label>
            <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary ut-label:text-primary"
            />
        </div>
    );
}
