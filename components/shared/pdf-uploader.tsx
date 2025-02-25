"use client";

import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";

import { useIsTablet } from "@/hooks/use-tablet";

export default function PdfUploader({ onUploadComplete }: { onUploadComplete: (url: string | null) => void }) {

    const { state } = useSidebar()
    const isTablet = useIsTablet()

    const handleUploadComplete = (resp: unknown) => {
        if (resp.length > 0) {
            const url = resp[0].url;
            onUploadComplete(url);
            toast.success("PDF uploaded successfully!");
        }
    };

    const handleUploadError = (error: unknown) => {
        toast.error("Upload failed: " + error);
    };

    return (
        <div className={`w-full space-y-2 ${state === "expanded" && isTablet ? "-z-10" : "z-0"}`}>
            <Label className="text-base">Upload PDF</Label>
            <UploadDropzone
                endpoint="pdfUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary ut-label:text-primary"
            />
        </div>
    );
}
