import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SearchCommunityTabForm() {

    const [searchValue, setSearchValue] = useState("")
    const router = useRouter()

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!searchValue.trim()) return
        router.push(`/search?communityName=${encodeURIComponent(searchValue.trim())}`)
        setSearchValue("")
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Search by community name</CardTitle>
                    <CardDescription>
                        The search field does not require an exact match with the community name; it retrieves communities whose titles or names contain the provided term.
                    </CardDescription>
                    <CardContent className="space-y-2 p-0">
                        <div className="space-y-1 mb-2">
                            <Label htmlFor="title" className="text-base">Title</Label>
                            <Input id="title" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="space-x-2 p-0 justify-end">
                        <Button type="button" variant="destructive" asChild>
                            <Link href={"/search"}>Reset</Link>
                        </Button>
                        <Button>Search</Button>
                    </CardFooter>
                </CardHeader>
            </Card>
        </form>
    )
}