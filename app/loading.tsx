import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
    return (
        <div className="h-full w-full max-w-7xl mx-auto flex items-center justify-center">
            <p className="flex items-center gap1">
                <LoaderCircleIcon className="w-10 h-10 text-primary animate-spin" />
                <span className="sr-only">Loading...</span>
            </p>
        </div>
    )
}