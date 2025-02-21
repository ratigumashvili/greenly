import Link from "next/link";
import { LetterTextIcon, Share2Icon } from "lucide-react";

import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { prisma } from "@/lib/prisma";

async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                userName: true,
                email: true,
                createdAt: true,
                SubcommunityMember: true,
                Post: true
            }
        })

        return users
    } catch (error) {
        console.log(error)
        return []
    }
}

export default async function UsersPage() {
    const users = await getUsers()
    return (
        <section className="py-8">
            <PageTitle>Registered users</PageTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {users && users.length !== 0 && users.map((user) => (
                    <Card key={user.id}>
                        <CardContent className="pt-4">
                            <p>{user.name} AKA @{user.userName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 text-sm mt-4" >
                                <p className="flex items-center gap-1">
                                    <Share2Icon className="w-4 h-4" /> Communities: {user.SubcommunityMember?.length}
                                </p>
                                <p className="flex items-center gap-1">
                                    <LetterTextIcon className="w-4 h-4" /> Posts: {user.Post?.length}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild>
                                <Link href={`/users/${user.id}`}>View more</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}