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

export function SearchUserTabForm() {

    const [searchValue, setSearchValue] = useState("")
    const router = useRouter()

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        router.push(`/search?userName=${searchValue}`)
        setSearchValue("")
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Search by user</CardTitle>
                    <CardDescription>
                        The search field does not require an exact match with the user&apos;s name or username; it retrieves users whose names or usernames contain the provided term. Do not include @ symbol while searching by username.
                    </CardDescription>
                    <CardContent className="space-y-2 p-0">
                        <div className="space-y-1 mb-2">
                            <Label htmlFor="name" className="text-base">Name / Username</Label>
                            <Input id="name" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
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