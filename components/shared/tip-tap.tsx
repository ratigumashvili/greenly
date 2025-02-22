'use client'

import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BoldIcon, CodeIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, QuoteIcon, StrikethroughIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null

    return <div className='flex flex-wrap gap-2'>
        <Button type="button" variant="outline" size="icon">
            <Heading1Icon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <Heading2Icon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <Heading3Icon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <BoldIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <ItalicIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <StrikethroughIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <ListIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <ListOrderedIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <LinkIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <QuoteIcon />
        </Button>
        <Button type="button" variant="outline" size="icon">
            <CodeIcon />
        </Button>
    </div>
}

const Tiptap = () => {
    const editor = useEditor({
        extensions: [StarterKit, Highlight, Typography],
        content: '<p>#Hello World! 🌎️</p>',
    })

    return (
        <section>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="border rounded-lg my-4 p-2 min-h-[400px] h-full" />
        </section>
    )
}

export default Tiptap
