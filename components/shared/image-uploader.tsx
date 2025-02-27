"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ImageUploader({ 
    onUploadComplete, 
    existingImages = [] 
}: { 
    onUploadComplete: (urls: string[]) => void;
    existingImages?: string[];
}) {
    const [uploadedImages, setUploadedImages] = useState(existingImages);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadComplete = (newImages: string[]) => {
        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages);
    };

    const handleSelectFiles = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));

        handleUploadComplete(newUrls);
    };

    const handleRemoveImage = (imageUrl: string) => {
        const updatedImages = uploadedImages.filter(url => url !== imageUrl);
        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {uploadedImages.map((url, index) => (
                    <div key={index} className="relative w-20 h-20 group">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover rounded-lg shadow-md" />
                        <button 
                            type="button"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <input 
                type="file" 
                accept="image/*" 
                multiple 
                ref={fileInputRef} 
                className="hidden"
                onChange={handleFileChange}
            />

            <Button onClick={handleSelectFiles} variant="outline" className="w-full sm:w-auto">
                Upload Images
            </Button>
        </div>
    );
}
