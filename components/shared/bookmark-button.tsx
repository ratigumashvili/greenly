"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";

import { addBookmark, removeBookmark } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function BookmarkButton({ postId, userId, isBookmarked }: { postId: string; userId: string; isBookmarked: boolean }) {
    const [isPending, startTransition] = useTransition();
    const [bookmarked, setBookmarked] = useState(isBookmarked);
    const router = useRouter();

    async function handleToggleBookmark() {
        if (!userId) {
            toast.error("You must be logged in to bookmark posts.");
            return;
        }

        startTransition(async () => {
            if (bookmarked) {
                await removeBookmark(userId, postId);
                toast.success("Bookmark removed");
            } else {
                await addBookmark(userId, postId);
                toast.success("Post bookmarked");
            }

            setBookmarked(!bookmarked);
            router.refresh();
        });
    }

    return (
        <Button
            variant="ghost" size="icon"
            onClick={handleToggleBookmark}
            disabled={isPending}
        >
            {bookmarked ? <BookmarkCheckIcon /> : <BookmarkIcon />}
        </Button>
    );
}
