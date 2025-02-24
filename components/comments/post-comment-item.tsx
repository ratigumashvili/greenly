"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EllipsisIcon } from "lucide-react";

import { CreatePostCommentForm } from "@/components/comments/create-post-comment-form";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { deleteComment } from "@/app/actions";

export function PostCommentItem({
    comment,
    handleReplyClick,
    isReplying,
    postId,
    communityId,
    onReplySuccess,
    isAdmin,
    subAdmin,
    userId
}: {
    comment: any;
    handleReplyClick: (id: string) => void;
    isReplying: string | null;
    postId: string;
    communityId: string;
    onReplySuccess?: () => void;
    isAdmin: boolean,
    subAdmin: boolean,
    userId: string
}) {

    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter()

    const handleDelete = async (idToDelete: string) => {
        setIsDeleting(true);

        const response = await deleteComment(idToDelete);

        if (response?.error) {
            toast.error(response.error);
        } else {
            toast.success(response.message);
            router.refresh()
        }

        setIsDeleting(false);
    };

    return (
        <Card key={comment.id} className="py-4 mb-4">
            <CardContent className="flex items-start justify-between">
                <div>
                    <p className="font-semibold">@{comment.author.userName}:</p>
                    <p>{comment.content}</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-20">
                        <DropdownMenuItem
                            onClick={() => handleReplyClick(comment.id)}
                            className="cursor-pointer"
                        >
                            Reply
                        </DropdownMenuItem>
                        {(comment.authorId === userId || isAdmin || subAdmin) && (
                            <DropdownMenuItem
                                onClick={() => handleDelete(comment.id)}
                                disabled={isDeleting}
                                className="block w-full cursor-pointer text-red-600 hover:text-red-800"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

            </CardContent>

            {isReplying === comment.id && (
                <CreatePostCommentForm
                    postId={postId}
                    subcommunityId={communityId}
                    parentId={comment.id}
                    onReplySuccess={onReplySuccess}
                />
            )}

            {comment.replies?.length > 0 && (
                <div className="ml-4">
                    {comment.replies.map((reply: any) => (
                        <PostCommentItem
                            key={reply.id}
                            comment={reply}
                            handleReplyClick={handleReplyClick}
                            isReplying={isReplying}
                            postId={postId}
                            communityId={communityId}
                            onReplySuccess={onReplySuccess}
                            isAdmin={isAdmin}
                            subAdmin={subAdmin}
                            userId={userId}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
}

