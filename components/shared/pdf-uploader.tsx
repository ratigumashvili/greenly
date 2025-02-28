"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsTablet } from "@/hooks/use-tablet";

interface PdfUploaderProps {
    onUploadComplete: (url: string | null) => void;
    existingFile?: string | null;
}

export default function PdfUploader({ onUploadComplete, existingFile }: PdfUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { state } = useSidebar();
    const isTablet = useIsTablet();

    const handleUploadComplete = (resp: any) => {
        if (resp.length > 0) {
            const url = resp[0].url;
            onUploadComplete(url);
            toast.success("PDF uploaded successfully!");
        }
    };

    return (
        <div className={`w-full space-y-2 ${state === "expanded" && isTablet ? "-z-10" : "z-0"}`}>
            {existingFile && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600">Current File: 
                        <a href={existingFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">
                            View PDF
                        </a>
                    </p>
                </div>
            )}

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
