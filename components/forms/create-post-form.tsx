"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownEditor from "@/components/shared/md-editor"; // ✅ Import MarkdownEditor
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/forms/submit-button";
import ImageUploader from "@/components/shared/image-uploader";
import PdfUploader from "@/components/shared/pdf-uploader";

import { useMyLocation } from "@/hooks/use-my-location";
import { createPost } from "@/app/actions";

export function CreatePostForm({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState<string>("");

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    const [locationEnabled, setLocationEnabled] = useState(false);
    const { address, getCurrentLocation, loading } = useMyLocation();

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
    
        const formData = new FormData(event.currentTarget);
        formData.set("content", content);
    
        formData.set("imagesUrl", JSON.stringify(imageUrls));
        formData.set("file", JSON.stringify(fileUrl));
    
        if (locationEnabled && address) {
            formData.set("location", address);
        } else {
            formData.set("location", "");
        }
    
        try {
            const response = await createPost(formData);
            if (response?.error) {
                toast.error(response.error);
            } else {
                toast.success("Post created successfully");
                router.push(`/g/${id}`);
            }
        } catch (error) {
            toast.error("Something went wrong.");
            console.error("Submission Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <form className="h-full" onSubmit={handleSubmit}>
            <input type="hidden" name="subcommunityId" value={id} />
            <div className="mb-4">
                <label htmlFor="title" className="text-base font-bold">Title</label>
                <input type="text" id="title" name="title" required className="w-full p-2 border rounded-md" />
            </div>

            <div className="mb-4">
                <label className="text-base font-bold">Content</label>
                <MarkdownEditor onContentChange={setContent} />
            </div>

            <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" id="attach-location" onChange={() => setLocationEnabled(!locationEnabled)} />
                <label htmlFor="attach-location">Attach my location</label>
            </div>

            {locationEnabled && (
                <div className="mb-3 flex items-center gap-2">
                    <Button onClick={getCurrentLocation} disabled={loading}>
                        {loading ? "Fetching location..." : "Get My Location"}
                    </Button>
                    {address && <Input type="text" defaultValue={address} className="py-4" />}
                </div>
            )}

            <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
                <ImageUploader onUploadComplete={setImageUrls} />
                <PdfUploader onUploadComplete={setFileUrl} />
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button asChild variant="secondary">
                    <Link href={`/g/${id}`}>Cancel</Link>
                </Button>
                <SubmitButton
                    title="Create post"
                    pendingTitle="Creating..."
                    isLoading={isLoading}
                    classNames="w-full sm:w-max"
                />
            </div>
        </form>
    );
}
