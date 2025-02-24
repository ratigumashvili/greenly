import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";

export function PostVoting() {
    return (
        <div className="h-max flex flex-col items-center justify-between text-muted-foreground">
            <button>
                <ArrowBigUpIcon className="w-4 h-6" />
            </button>
            <span className="text-sm">0</span>
            <button>
                <ArrowBigDownIcon className="w-4 h-6" />
            </button>
        </div>
    )
}