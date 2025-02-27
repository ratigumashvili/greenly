"use client";

import { useState } from "react";
import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing";
import { useSidebar } from "@/components/ui/sidebar";

import { useIsTablet } from "@/hooks/use-tablet";

export default function PdfUploader({ onUploadComplete }: { onUploadComplete: (url: string | null) => void }) {
    const [isUploading, setIsUploading] = useState(false);
    const { state } = useSidebar()
    const isTablet = useIsTablet()

    const handleUploadComplete = (resp: any) => {
        if (resp.length > 0) {
            const url = resp[0].url;
            onUploadComplete(url);
            toast.success("PDF uploaded successfully!");
        }
    };

    return (
        <div className={`w-full space-y-2 ${state === "expanded" && isTablet ? "-z-10" : "z-0"}`}>
            <UploadDropzone
                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary ut-label:text-primary"
                endpoint="pdfUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadBegin={() => setIsUploading(true)}
                onUploadError={(error) => {
                    toast.error(`Upload failed: ${error.message}`);
                    setIsUploading(false);
                }}
            />
            {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>
    );
}
