"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EditorContent, useEditor, JSONContent } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { toast } from "sonner";

import { updatePost } from "@/app/actions";
import { MenuBar } from "../shared/tip-tap";

export function EditPostForm({
    post
}: { post: { id: string; title: string; content: any, subcommunityId: string } }) {

    const [title, setTitle] = useState(post.title)
    const [isLoading, setIsLoading] = useState(false)
    const [content, setContent] = useState<JSONContent>(
        typeof post.content === "string" ? JSON.parse(post.content) : post.content
    );

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

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Edit post</h2>
            
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
                    <Label htmlFor="content" className="text-base">Edit content</Label>
                    <MenuBar editor={editor} />
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