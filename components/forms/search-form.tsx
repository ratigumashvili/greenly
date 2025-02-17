import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input"

export function SearchForm() {
    return (
        <form className="relative hidden md:block w-full max-w-[400px] ">
            <Input
                placeholder="Search greenly"
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