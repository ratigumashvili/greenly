"use client";

import { useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import styles

interface MarkdownEditorProps {
    initialContent?: string;
    onContentChange: (content: string) => void;
}

const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleChange = (value: string) => {
        setContent(value);
        onContentChange(value); // ✅ Pass content to parent
    };

    return <SimpleMDE value={content} onChange={handleChange} />;
};

export default MarkdownEditor;
