"use client"

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import MarkdownEditor from "@/components/shared/md-editor";
import ImageUploader from "@/components/shared/image-uploader";
import PdfUploader from "@/components/shared/pdf-uploader";

import { useModalStore } from "@/store/modal-store";
import { deletePost, updatePost } from "@/app/actions";
import { useMyLocation } from "@/hooks/use-my-location";

export function EditPostForm({ post }: {
    post: {
        id: string;
        title: string;
        content: string;
        subcommunityId: string;
        imagesUrl?: string[];
        file?: string | null;
        location?: string;
    }
}) {
    const router = useRouter();
    const { openModal } = useModalStore();

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState<string>(post.content);
    const [imagesUrl, setImagesUrl] = useState<string[]>(post.imagesUrl || []);
    const [file, setFile] = useState<string | null>(post.file || null);
    const [location, setLocation] = useState<string>(post.location || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { address, getCurrentLocation, loading } = useMyLocation();

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const response = await updatePost({
            postId: post.id,
            title,
            content,
            imagesUrl,
            file,
            location,
        });

        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success("Post updated successfully");
            router.push(`/g/posts/${post.id}?communityId=${post.subcommunityId}`);
        }
        setIsLoading(false);
    }, [post.id, title, content, imagesUrl, file, location]);

    const handleDeletePost = useCallback(async () => {
        setIsDeleting(true);
        const response = await deletePost({ postId: post.id });

        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success("Post deleted successfully");
            router.push(`/g/${post.subcommunityId}`);
        }
        setIsDeleting(false);
    }, [post.id]);

    useEffect(() => {
        if (address) {
            setLocation(address);
        }
    }, [address]);

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() =>
                        openModal({
                            title: "Delete this post?",
                            description: "Are you sure you want to delete this post? This action cannot be undone.",
                            confirmText: "Delete",
                            cancelText: "Cancel",
                            onConfirm: handleDeletePost,
                        })
                    }
                >
                    {isDeleting ? "Deleting..." : "Delete Post"}
                </Button>
            </div>

            <div>
                <label htmlFor="title" className="text-base font-bold">Edit Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" />
            </div>

            <div>
                <label className="text-base font-bold">Edit Content</label>
                <MarkdownEditor initialContent={content} onContentChange={setContent} />
            </div>

            <div className="flex gap-4">
                <div className="w-full">
                    <label className="text-base font-bold">Update Images</label>
                    <ImageUploader onUploadComplete={setImagesUrl} existingImages={imagesUrl} />
                </div>
                <div className="w-full">
                    <label className="text-base font-bold">Update File</label>
                    <PdfUploader onUploadComplete={setFile} existingFile={file} />
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <Label className="text-base font-bold">Edit Location</Label>
                <div className="flex gap-2 items-center">
                    <Button
                        type="button"
                        onClick={() => getCurrentLocation()}
                        disabled={loading}
                    >
                        {loading ? "Fetching location..." : "Get My Location"}
                    </Button>
                    <Input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>


            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" asChild>
                    <Link href={`/g/posts/${post.id}?communityId=${post.subcommunityId}`}>Cancel</Link>
                </Button>
                <SubmitButton
                    title="Update"
                    pendingTitle="Updating..."
                    isLoading={isLoading}
                    classNames="w-full sm:w-max"
                />
            </div>
        </form>
    );
}
