import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/shared/user-dropdown";
import { SearchForm } from "@/components/forms/search-form";

import { authSession } from "@/lib/auth";

export async function Navbar() {

    const session = await authSession()

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

            <SearchForm />

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