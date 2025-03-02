// "use client";

// import { useEffect, useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css";

// interface MarkdownEditorProps {
//     initialContent?: string;
//     onContentChange: (content: string) => void;
// }

// const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
//     const [content, setContent] = useState(initialContent);

//     useEffect(() => {
//         setContent(initialContent);
//     }, [initialContent]);

//     const handleChange = (value: string) => {
//         setContent(value);
//         onContentChange(value);
//     };

//     return (
//         <SimpleMDE
//         value={content}
//         onChange={handleChange}
//         options={{
//             toolbar: [
//                 "bold", "italic", "heading", "|",
//                 "quote", "unordered-list", "ordered-list", "link", "image", "|",
//                 "fullscreen"
//             ],
//             spellChecker: false,
//         }}
//         />
//     )
// };

// export default MarkdownEditor;

// "use client";

// import { useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css";

// interface MarkdownEditorProps {
//     initialContent?: string;
//     onContentChange: (content: string) => void;
// }

// const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
//     const [content, setContent] = useState(initialContent);

//     const handleChange = (value: string) => {
//         setContent(value);
//         onContentChange(value);
//     };

//     return (
//         <SimpleMDE
//             value={content}
//             onChange={handleChange}
//             options={{
//                 autofocus: true, // ✅ This might have been present initially
//                 status: false, // ✅ Removes the status bar
//                 toolbar: [
//                     "bold", "italic", "strikethrough", "heading", "|",
//                     "quote", "unordered-list", "ordered-list", "|",
//                     "link", "image", "table", "|",
//                     "side-by-side", "fullscreen", "guide"
//                 ], // ✅ Restored exact toolbar
//                 spellChecker: false,
//             }}
//         />
//     );
// };

// export default MarkdownEditor;








// "use client";

// import { useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css";

// interface MarkdownEditorProps {
//     initialContent?: string;
//     onContentChange: (content: string) => void;
// }

// const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
//     const [content, setContent] = useState(initialContent);

//     const handleChange = (value: string) => {
//         setContent(value);
//         onContentChange(value);
//     };

//     return (
//         <SimpleMDE
//             value={content}
//             onChange={handleChange}
//             options={{
//                 autofocus: true, // ✅ The original might have had autofocus
//                 status: false, // ✅ Disables status bar
//                 toolbar: [
//                     "bold", "italic", "heading", "|",
//                     "quote", "unordered-list", "ordered-list", "|",
//                     "link", "image", "table", "|",
//                     "fullscreen"
//                 ], // ✅ Using a toolbar that matches our early versions
//                 spellChecker: false,
//             }}
//         />
//     );
// };

// export default MarkdownEditor;



// "use client";

// import { useEffect, useRef, useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css";

// interface MarkdownEditorProps {
//     initialContent?: string;
//     onContentChange: (content: string) => void;
// }

// const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
//     const [content, setContent] = useState(initialContent);
//     const editorRef = useRef<any>(null);
//     const cursorRef = useRef<{ line: number; ch: number } | null>(null); // Store cursor position

//     useEffect(() => {
//         if (editorRef.current) {
//             editorRef.current.value(initialContent);
//         }
//     }, [initialContent]);

//     const handleChange = (value: string) => {
//         if (editorRef.current) {
//             // ✅ Store cursor position before updating content
//             cursorRef.current = editorRef.current.codemirror.getCursor();
//         }

//         setContent(value);
//         onContentChange(value);

//         if (editorRef.current && cursorRef.current) {
//             // ✅ Restore cursor position after content updates
//             setTimeout(() => {
//                 editorRef.current.codemirror.setCursor(cursorRef.current!);
//             }, 0);
//         }
//     };

//     return (
//         <SimpleMDE
//             getMdeInstance={(instance) => (editorRef.current = instance)}
//             value={content}
//             onChange={handleChange}
//             options={{
//                 autofocus: true,
//                 status: false,
//                 toolbar: [
//                     "bold", "italic", "heading", "|",
//                     "quote", "unordered-list", "ordered-list", "|",
//                     "link", "image", "|",
//                     "side-by-side", "fullscreen"
//                 ],
//                 spellChecker: false,
//             }}
//         />
//     );
// };

// export default MarkdownEditor;









// ORIGINAL

// "use client";

// import { useEffect, useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import "easymde/dist/easymde.min.css"; // Import styles

// interface MarkdownEditorProps {
//     initialContent?: string;
//     onContentChange: (content: string) => void;
// }

// const MarkdownEditor = ({ initialContent = "", onContentChange }: MarkdownEditorProps) => {
//     const [content, setContent] = useState(initialContent);

//     useEffect(() => {
//         setContent(initialContent);
//     }, [initialContent]);

//     const handleChange = (value: string) => {
//         setContent(value);
//         onContentChange(value); // ✅ Pass content to parent
//     };

//     return (
//         <SimpleMDE
//             value={content}
//             onChange={handleChange}
//         />
//     )
// };

// export default MarkdownEditor;


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
                    "link", "image", "table", "|",
                    "fullscreen"
                ],
                spellChecker: false,
            }}
        />
    );
};

export default MarkdownEditor;
