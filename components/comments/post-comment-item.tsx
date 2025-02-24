import { CreatePostCommentForm } from "@/components/comments/create-post-comment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PostCommentItem({
    comment,
    handleReplyClick,
    isReplying,
    postId,
    communityId,
    onReplySuccess
}: {
    comment: any;
    handleReplyClick: (id: string) => void;
    isReplying: string | null;
    postId: string;
    communityId: string;
    onReplySuccess?: () => void;
}) {
    return (
        <Card key={comment.id} className="py-4">
            <CardContent className="flex items-start justify-between">
                <div>
                    <p className="font-semibold">@{comment.author.userName}:</p>
                    <p>{comment.content}</p>
                </div>
                <Button variant="ghost" onClick={() => handleReplyClick(comment.id)}>Reply</Button>
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
                            onReplySuccess={onReplySuccess} // ✅ Pass it down
                        />
                    ))}
                </div>
            )}
        </Card>
    );
}

