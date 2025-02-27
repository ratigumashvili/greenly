"use client";

import { useState } from "react";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UploadDropzone } from "@/lib/uploadthing";

export default function ImageUploader({
    onUploadComplete,
    existingImages = []
}: {
    onUploadComplete: (urls: string[]) => void;
    existingImages?: string[];
}) {
    const [uploadedImages, setUploadedImages] = useState(existingImages);
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadComplete = (uploadedFiles: { url: string }[]) => {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            toast.error("No files uploaded.");
            return;
        }

        const newUrls = uploadedFiles.map(file => file.url);
        const updatedImages = [...uploadedImages, ...newUrls];

        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages);
        toast.success("Images uploaded successfully!");
    };

    const handleRemoveImage = (imageUrl: string) => {
        const updatedImages = uploadedImages.filter(url => url !== imageUrl);
        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages);
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {uploadedImages.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 group">
                            <img src={url} alt="Uploaded" className="w-full h-full object-cover rounded-lg shadow-md" />
                            <Button
                                size="icon"
                                variant="destructive"
                                type="button"
                                onClick={() => handleRemoveImage(url)}
                                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XIcon />
                            </Button>
                        </div>
                    ))}
                </div>

                <UploadDropzone
                    className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary ut-label:text-primary"
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadBegin={() => setIsUploading(true)}
                    onUploadError={(error) => {
                        toast.error(`Upload failed: ${error.message}`);
                        setIsUploading(false);
                    }}
                />
                {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>
        </>
    );
}
