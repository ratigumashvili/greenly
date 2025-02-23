"use client"

import { tiptapJsonToHtml } from "@/lib/utils";

export default function PostContent({ content }: { content: any }) {
    let parsedContent: string = "";

    if (typeof content === "string") {
        parsedContent = content; // Already a string
    } else if (typeof content === "object" && content !== null) {
        parsedContent = JSON.stringify(content); // Convert JSON object to string
    } else {
        parsedContent = "{}"; // Fallback for invalid content
    }

    return <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: tiptapJsonToHtml(parsedContent) }} />;
}