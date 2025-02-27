"use client";

import { useState } from "react";

export default function ImageUploader({ 
    onUploadComplete, 
    existingImages = [] 
}: { 
    onUploadComplete: (urls: string[]) => void;
    existingImages?: string[];
}) {
    const [uploadedImages, setUploadedImages] = useState(existingImages);

    const handleUploadComplete = (newImages: string[]) => {
        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages);
    };

    const handleRemoveImage = (imageUrl: string) => {
        const updatedImages = uploadedImages.filter(url => url !== imageUrl);
        setUploadedImages(updatedImages);
        onUploadComplete(updatedImages); 
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-2">
                {uploadedImages.map((url, index) => (
                    <div key={index} className="relative">
                        <img src={url} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
                        <button 
                            type="button"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
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
                onChange={(e) => {
                    if (!e.target.files) return;
                    
                    const newUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file));

                    handleUploadComplete(newUrls);
                }}
            />
        </div>
    );
}
