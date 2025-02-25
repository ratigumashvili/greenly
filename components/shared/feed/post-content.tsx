"use client"

import { cn, tiptapJsonToHtml } from "@/lib/utils";

export default function PostContent({ content, className }: { content: unknown, className?: string }) {
    let parsedContent: string = "";

    if (typeof content === "string") {
        parsedContent = content;
    } else if (typeof content === "object" && content !== null) {
        parsedContent = JSON.stringify(content);
    } else {
        parsedContent = "{}";
    }

    return <div className={cn("[&_p]:mb-3", className)} dangerouslySetInnerHTML={{ __html: tiptapJsonToHtml(parsedContent) }} />;
}