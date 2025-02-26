import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function SearchByTags({ tags, tagName }: { tags: { name: string }[], tagName: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Search by community tag</CardTitle>
                <CardDescription>
                    Here you can filter communities by their tags.
                </CardDescription>
                <CardContent className="space-y-2 p-0">
                    <div className="flex flex-wrap gap-3 my-2">
                        {tags.map((tag, index) => (
                            <Link
                                key={index}
                                href={`/search?tagName=${tag.name}`}
                                className={`${tagName === tag.name ? "text-primary" : "text-base"} text-base`}
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="space-x-2 p-0 justify-end">
                    <Button type="button" variant="destructive" asChild>
                        <Link href={"/search"}>Reset</Link>
                    </Button>
                </CardFooter>
            </CardHeader>
        </Card>
    )
}