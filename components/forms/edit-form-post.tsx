"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { EditorContent, useEditor, JSONContent } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { MenuBar } from "@/components/shared/tip-tap";

import { deletePost, updatePost } from "@/app/actions";
import { useModalStore } from "@/store/modal-store";

export function EditPostForm({
    post
}: { post: { id: string; title: string; content: any, subcommunityId: string } }) {

    const [title, setTitle] = useState(post.title)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [content, setContent] = useState<JSONContent>(
        typeof post.content === "string" ? JSON.parse(post.content) : post.content
    );

    const { openModal } = useModalStore()

    const router = useRouter()

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getJSON());
        },
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

        event.preventDefault()

        setIsLoading(true)

        if (!editor) {
            setIsLoading(false)
            return
        }

        const updatedContent = editor.getJSON()

        const response = await updatePost({
            postId: post.id,
            title,
            content: updatedContent
        })

        if (response.error) {
            toast.error(response.error)
        } else {
            toast.success("Post updated successfully")
            router.push(`/g/posts/${post.id}?communityId=${post.subcommunityId}`)
        }

        setIsLoading(false)

    }

    async function handleDeletePost(event?: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault()
        setIsDeleting(true)
        const response = await deletePost({
            postId: post.id
        })
        if (response.error) {
            toast.error(response.error)
        } else {
            toast.success("Post deleted successfully")
            router.push(`/g/${post.subcommunityId}`)
        }
        setIsDeleting(false)
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">Edit post</h2>
                <form onSubmit={handleDeletePost}>
                    <Button
                        variant="destructive"
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                            openModal({
                                title: "Delete this post?",
                                description: "Are you sure you want to delete this post? This action can not be undone.",
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                onConfirm: () => handleDeletePost(),
                            })
                        }
                    >
                        Delete post
                    </Button>
                </form>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Edit title</Label>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-base">Edit content</Label>
                    <div className="my-6">
                        <MenuBar editor={editor} />
                    </div>
                    <EditorContent editor={editor} />
                </div>

                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="secondary" asChild>
                        <Link href={`/g/posts/${post.id}?communityId=${post.subcommunityId}`}>Cancel</Link>
                    </Button>
                    <SubmitButton
                        title="Update"
                        pendingTitle="Updating..."
                        isLoading={isLoading}
                        classNames="w-full md:w-max"
                    />
                </div>

            </form>
        </>
    )
}