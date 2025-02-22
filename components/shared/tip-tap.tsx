'use client'

import { useState } from 'react';
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent, type Editor, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
    BoldIcon,
    CodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    HighlighterIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    QuoteIcon,
    StrikethroughIcon,
    UnlinkIcon
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const MenuBar = ({ editor }: { editor: Editor | null }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [url, setUrl] = useState("");

    if (!editor) return null

    const handleConfirm = () => {
        if (url.trim() === "") {
            editor.chain().focus().unsetLink().run(); // Remove link if empty
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
        setDialogOpen(false);
        setUrl(""); // Reset input field
    };

    const handleRemoveLink = () => {
        editor.chain().focus().unsetLink().run();
        setDialogOpen(false);
    };


    return <div className='flex flex-wrap gap-2'>
        <Button
            type="button"
            variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
            <Heading1Icon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
            <Heading2Icon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
            <Heading3Icon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("bold") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
        >
            <BoldIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("italic") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
        >
            <ItalicIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("strike") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleStrike().run()}
        >
            <StrikethroughIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("highlight") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
            <HighlighterIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("bulletList") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
            <ListIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("orderedList") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
            <ListOrderedIcon />
        </Button>
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setDialogOpen(true)}
        >
            <LinkIcon />
        </Button>
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemoveLink}
            disabled={!editor.isActive("link")}
        >
            <UnlinkIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("blockquote") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
            <QuoteIcon />
        </Button>
        <Button
            type="button"
            variant={editor.isActive("codeBlock") ? "default" : "outline"}
            size="icon"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
            <CodeIcon />
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                </DialogHeader>
                <Input
                    type="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <DialogFooter>
                    <Button type="button" onClick={handleConfirm}>Confirm</Button>
                    <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
}

const Tiptap = () => {
    const [json, setJson] = useState<JSONContent | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            Link.configure({
                openOnClick: true,
                autolink: true,
                linkOnPaste: true,
            }),],
        content: json ?? '<p>Create your post</p>',
        editorProps: {
            attributes: {
                class: "prose"
            }
        },
        onUpdate: ({editor}) => {
            setJson(editor.getJSON());
        }
    })

    return (
        <section>
            <input type="hidden" name="content" value={json ? JSON.stringify(json) : ""} />
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="border rounded-lg my-4 p-2 min-h-[250px] h-full" />
        </section>
    )
}

export default Tiptap
