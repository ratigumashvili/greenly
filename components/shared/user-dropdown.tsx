"use client"

import { signOut } from "next-auth/react";
import { LogOutIcon } from 'lucide-react';


import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { menuSmall } from "@/lib/constants";

interface UserDropdownProps {
    name: string
}

export function UserDropdown({ name }: UserDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-10 h-10 rounded-full flex items-center justify-center text-lg">
                    {name?.[0]?.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">

                {menuSmall.map((item) => (
                    <DropdownMenuItem asChild key={item.title}>
                        <div className="flex items-center gap-2">
                            <item.icon /> <Link href={item.url} className="block w-full">{item.title}</Link>
                        </div>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full cursor-pointer">
                        <LogOutIcon /> <span className="pl-2">Sign out</span>
                    </button>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}