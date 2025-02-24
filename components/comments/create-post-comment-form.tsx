"use client";

import { useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/forms/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createComment } from "@/app/actions"
import { useRouter } from "next/navigation";

export function CreatePostCommentForm({
    postId,
    subcommunityId,
    parentId,
    onReplySuccess
}: {
    postId: string;
    subcommunityId: string;
    parentId?: string | null;
    onReplySuccess?: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append("postId", postId);
        formData.append("subcommunityId", subcommunityId);
        if (parentId) formData.append("parentId", parentId); // ✅ Only append if it's a reply

        const response = await createComment(formData);

        if (response?.error) {
            toast.error(response.error);
        } else {
            toast.success(response.message);
            setText("");
            onReplySuccess?.();
            router.refresh()
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="my-6 space-y-4">
            {parentId && <input type="hidden" name="parentId" value={parentId} />}
            <div className="mb-4">
                <Textarea
                    name="content"
                    required
                    className="w-full border p-2 rounded-md"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                        setText("");
                        onReplySuccess?.();
                    }}
                    className="w-full md:w-max"
                    >
                    Cancel
                </Button>
                <SubmitButton isLoading={isLoading} title="Post comment" pendingTitle="Posting..." classNames="w-full md:w-max" size="lg" />
            </div>
        </form>
    );
}
