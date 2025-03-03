"use client";

import { useEffect, useRef, useState } from "react";
import SimpleMDE, { SimpleMDEReactProps } from "react-simplemde-editor";
import { marked } from "marked";
import DOMPurify from "dompurify";
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

        renderingConfig: {
            codeSyntaxHighlighting: true,
            singleLineBreaks: true,
        },

        toolbar: [
            "bold" as const, 
            "italic" as const, 
            "strikethrough" as const,
            "heading" as const, "|",
            "quote" as const, 
            "unordered-list" as const, 
            "ordered-list" as const, "|",
            "link" as const, 
            "image" as const, 
            "table" as const,
            "horizontal-rule" as const, "|",
            "redo" as const,
            "undo" as const, "|",
            "preview" as const, 
            "side-by-side" as const, 
            "fullscreen" as const
        ],

        previewRender: (plainText) => {
            const result = marked.parse(plainText);

            // ✅ Check if result is a Promise and handle both cases
            if (result instanceof Promise) {
                result.then((parsedHTML) => {
                    return DOMPurify.sanitize(parsedHTML);
                });
                return "Loading preview..."; // Placeholder while Promise resolves
            }

            return DOMPurify.sanitize(result); // If it's a string, sanitize & return it
        }
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
            options={optionsRef.current}
        />
    );
};

export default MarkdownEditor;

