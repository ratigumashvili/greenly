"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input"

export function SearchForm() {
    const [searchValue, setSearchValue] = useState("")
    const router = useRouter()

    function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        router.push(`/search?name=${searchValue}`)
        setSearchValue("")
    }
    
    return (
        <form className="relative hidden md:block w-full max-w-[400px]" onSubmit={handleFormSubmit}>
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search greenly communities"
                className="rounded-full pl-9 placeholder:text-muted-foreground bg-slate-50"
            />
            <button className="absolute top-1/2 left-2 -translate-y-1/2 t">
                <SearchIcon
                    className="size-5 ext-muted-foreground"
                />
            </button>
        </form>
    )
}