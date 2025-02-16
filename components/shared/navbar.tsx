import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="h-[10vh] w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 lg:px-10 border-b">
            <Link href={'/'}>
                <Image
                    src={'/logo-lg.svg'}
                    width={150}
                    height={150}
                    alt="Logo"
                />
            </Link>
            <div className="relative w-full max-w-[400px] ">
                <Input
                    placeholder="Search greenly"
                    className="rounded-full pl-9 placeholder:text-muted-foreground bg-slate-50"
                />
                <SearchIcon
                    className="size-5 absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground"
                />
            </div>
            <div className="flex items-center gap-x-2">
                <Button>Register</Button>
                <Button variant="outline">Login</Button>
            </div>
        </nav>
    )
}