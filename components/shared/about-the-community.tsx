import Link from "next/link";
import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"
import { CreatedAt } from "@/components/shared/created-at";
import { SubcommunityMemberList } from "@/components/shared/subcommunity-member-list";
import { JoinCommunityButton } from "@/components/forms/join-community-button";

import { prisma } from "@/lib/prisma";
import { getUserData } from "@/lib/utils";

async function getData(id: string) {
    const data = await prisma.subcommunity.update({
        where: { id },
        data: {
            views: { increment: 1 }
        },
        select: {
            id: true,
            name: true,
            description: true,
            views: true,
            createdAt: true,
            User: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    userName: true
                }
            },
            tags: {
                select: {
                    subcommunityId: true,
                    tag: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            },
            members: {
                select: {
                    userId: true,
                }
            }
        }
    });

    return data;
}

export async function AboutTheCommunity({id}: {id: string}) {
    
        const data = await getData(id)
        const { session, user } = await getUserData(id)
    
        const isMember = user ? data.members.some(member => member.userId === user.id) : false;
        const isCreator = user?.email === data.User?.email;
        const isAdmin = user?.SubcommunityMember[0]?.role === "admin"

    return (
        <div className="col-span-10 md:col-span-4 lg:col-span-3">            
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">About the community</h2>
                {(isCreator || isAdmin || user?.isAdmin) &&
                    (
                        <Button variant="secondary" size="icon" asChild>
                            <Link href={`/g/edit?recordId=${data.id}`}>
                                <SettingsIcon />
                            </Link>
                        </Button>
                    )}
            </div>

            <p className="text-muted-foreground">{data.description}</p>
            <Separator className="my-4" />
            <p className="mb-2 text-sm">Tags:</p>
            <div className="flex flex-wrap gap-2">
                {data.tags.map((item, index) => (
                    <Badge key={index} className="hover:cursor-pointer">{item.tag.name}</Badge>
                ))}
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
                <p className="text-sm">
                    Created by: <Link className="text-primary hover:text-primary/90 transition" href={`mailto:${data.User?.email}`}>
                        @{data.User?.userName}
                    </Link>, <CreatedAt date={data.createdAt} />.
                </p>
                <SubcommunityMemberList subcommunityId={id} isMember={isMember} />
            </div>
            {session && (
                <JoinCommunityButton subcommunityId={data.id} isMember={isMember} />
            )}
        </div>
    )
}