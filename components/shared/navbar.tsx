import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { UserDropdown } from "@/components/shared/user-dropdown";

import { auth, signOut } from "@/lib/utils";

export async function Navbar() {

    const session = await auth()

    return (
        <nav className="h-[10vh] w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 lg:px-10 border-b">
            <Link href={'/'}>
                <Image
                    src={'/logo-lg.svg'}
                    width={150}
                    height={150}
                    alt="Logo desktop"
                    className="hidden lg:block"
                />
                <Image
                    src={'/logo-sm.svg'}
                    width={40}
                    height={40}
                    alt="Logo mobile"
                    className="block lg:hidden h-10 min-h-10 w-fit"
                />
            </Link>
            <div className="relative hidden md:block w-full max-w-[400px] ">
                <Input
                    placeholder="Search greenly"
                    className="rounded-full pl-9 placeholder:text-muted-foreground bg-slate-50"
                />
                <SearchIcon
                    className="size-5 absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground"
                />
            </div>
            <div className="flex items-center gap-x-2">
                {session?.user ? (
                    <>
                        <UserDropdown name={session?.user?.name || "U"} />
                    </>
                ) : (
                    <>
                        <Button variant="outline" asChild>
                            <Link href={'/login'}>Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href={'/sign-up'}>Sign up</Link>
                        </Button>
                    </>
                )}
                <Button className="md:hidden">
                    <SearchIcon
                        className="text-white"
                    />
                </Button>
            </div>
        </nav>
    )
}