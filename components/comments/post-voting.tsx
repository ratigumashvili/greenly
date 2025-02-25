import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";

export function PostVoting({
    postId,
    communityId,
}: {
    postId: string,
    communityId: string
}) {
    return (
        <div className="h-max flex flex-col items-center justify-between text-muted-foreground">
            <form>
                <input type="hidden" name="postId" value={postId} />
                <input type="hidden" name="direction" value="UP" />
                <input type="hidden" name="subcommunity" value={communityId} />
                <button>
                    <ArrowBigUpIcon className="w-4 h-6" />
                </button>
            </form>
            <span className="text-sm">0</span>
            <form>
                <input type="hidden" name="postId" value={postId} />
                <input type="hidden" name="direction" value="DOWN" />
                <input type="hidden" name="subcommunity" value={communityId} />
                <button>
                    <ArrowBigDownIcon className="w-4 h-6" />
                </button>
            </form>
        </div >
    )
}