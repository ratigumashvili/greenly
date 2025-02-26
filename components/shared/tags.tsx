import Link from "next/link"

import { Button } from "@/components/ui/button"

import { getAllTags } from "@/app/actions"

export async function Tags({tagName} : { tagName: string }) {

    const tags = await getAllTags()

    return (
        <>
            <h2 className="font-bold text-xl mb-4">Filter by tags</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <Button
                        key={index}
                        variant={tagName === tag.name ? "default" : "outline"}
                        asChild
                    >
                        <Link href={`/search?tagName=${tag.name}`}>{tag.name}</Link>
                    </Button>
                ))}
                <Button variant="destructive" asChild>
                    <Link href={'/search'}>Reset</Link>
                </Button>
            </div>
        </>
    )
}