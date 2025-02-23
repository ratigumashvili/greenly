"use client"

import { Button } from "@/components/ui/button";
import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

interface CopyFeedItemProps {
    communityId: string
    postId: string
}

export function CopyFeedItem({communityId, postId}: CopyFeedItemProps) {

    function handleCopyToClipboard() {
        navigator.clipboard.writeText(`${location.origin}/g/posts/${postId}?communityId=${communityId}`)
        toast.success("Url copied to clipboard")
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
            <ShareIcon className="w-4 h-4 text-muted-foreground" />
        </Button>
    )
}