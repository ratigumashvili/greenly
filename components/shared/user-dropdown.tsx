"use client"

import { signOut } from "next-auth/react";
import { LogOutIcon, PlusIcon, SettingsIcon, TextIcon } from 'lucide-react';


import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserDropdownProps {
    name: string
}

export function UserDropdown({ name }: UserDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-10 h-10 rounded-full flex items-center justify-center text-xl">
                    {name?.[0]?.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem asChild>
                    <Link href={'/g/create'} className="hover:cursor-pointer">
                    <PlusIcon /> <span className="pl-2">Create community</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={'/create'} className="hover:cursor-pointer">
                    <TextIcon /> <span className="pl-2">Create post</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={'/settings'} className="hover:cursor-pointer">
                    <SettingsIcon /> <span className="pl-2">Settings</span>
                    </Link>
                </DropdownMenuItem>
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