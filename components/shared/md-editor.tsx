"use client";

import { useEffect, useRef, useState } from "react";
import SimpleMDE, { SimpleMDEReactProps } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
    initialContent?: string;
    onContentChange: (content: string) => void;
}

const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
    const [content, setContent] = useState(initialContent);
    const editorRef = useRef<any>(null); 

    const optionsRef = useRef<SimpleMDEReactProps["options"]>({
        autofocus: true,
        status: false,
        spellChecker: false,
        toolbar: [
            "bold" as const, 
            "italic" as const, 
            "heading" as const, "|",
            "quote" as const, 
            "unordered-list" as const, 
            "ordered-list" as const, "|",
            "link" as const, 
            "image" as const, 
            "table" as const, "|",
            "preview" as const, 
            "side-by-side" as const, 
            "fullscreen" as const
        ],
    });

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
                    editorRef.current = instance;
                }
            }}
            value={content}
            onChange={handleChange}
            options={optionsRef.current} // ✅ Always use stored options
        />
    );
};

export default MarkdownEditor;

