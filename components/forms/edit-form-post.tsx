"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { EditorContent, useEditor, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { MenuBar } from "@/components/shared/tip-tap";
import ImageUploader from "@/components/shared/image-uploader";

import { deletePost, updatePost } from "@/app/actions";
import { useModalStore } from "@/store/modal-store";

export function EditPostForm({ post }: { 
    post: { 
        id: string; 
        title: string; 
        content: any; 
        subcommunityId: string; 
        imagesUrl?: string[]; 
    } 
}) {
    const router = useRouter();
    const { openModal } = useModalStore();

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState<JSONContent>(
        typeof post.content === "string" ? JSON.parse(post.content) : post.content
    );
    const [imagesUrl, setImagesUrl] = useState<string[]>(post.imagesUrl || []);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor }) => setContent(editor.getJSON()),
    });

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editor) return;

        setIsLoading(true);
        const response = await updatePost({
            postId: post.id,
            title,
            content: editor.getJSON(),
            imagesUrl, 
        });

        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success("Post updated successfully");
            router.push(`/g/posts/${post.id}?communityId=${post.subcommunityId}`);
        }
        setIsLoading(false);
    }, [editor, post.id, title, imagesUrl]);

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

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
                <Button
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

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="title">Edit Title</Label>
                    <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label>Edit Content</Label>
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} />
                </div>

                <div className="space-y-2">
                    <Label>Update Images</Label>
                    <ImageUploader onUploadComplete={setImagesUrl} existingImages={imagesUrl} />
                </div>

                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="secondary" asChild>
                        <Link href={`/g/posts/${post.id}?communityId=${post.subcommunityId}`}>Cancel</Link>
                    </Button>
                    <SubmitButton title="Update" pendingTitle="Updating..." isLoading={isLoading} classNames="w-full sm:w-max" />
                </div>
            </form>
        </div>
    );
}
