"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enables GitHub-flavored Markdown (tables, strikethrough, etc.)
import { cn } from "@/lib/utils";

export default function PostContent({ content, className }: { content: string; className?: string }) {
    return (
        <div className={cn("prose max-w-none", className)}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
}
