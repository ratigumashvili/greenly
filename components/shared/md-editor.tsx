"use client";

import { useEffect, useRef, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
    initialContent?: string;
    onContentChange: (content: string) => void;
}

const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
    const [content, setContent] = useState(initialContent);
    const editorRef = useRef<any>(null); // ✅ Store SimpleMDE instance

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleChange = (value: string) => {
        setContent(value);
        onContentChange(value);
    };

    return (
        <SimpleMDE
            getMdeInstance={(instance) => {
                if (!editorRef.current) {
                    editorRef.current = instance; // ✅ Set instance only once
                }
            }}
            value={content}
            onChange={handleChange}
            options={editorRef.current ? undefined : { // ✅ Apply options only once
                autofocus: true,
                status: false,
                toolbar: [
                    "bold", "italic", "heading", "|",
                    "quote", "unordered-list", "ordered-list", "|",
                    "link", "image", "|",
                    "fullscreen"
                ],
                spellChecker: false,
            }}
        />
    );
};

export default MarkdownEditor;
