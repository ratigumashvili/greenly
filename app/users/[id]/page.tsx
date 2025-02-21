import dynamic from "next/dynamic"

import { prisma } from "@/lib/prisma"

import { PageTitle } from "@/components/shared/page-title"
import DynamicGraph from "./graph"
import { Separator } from "@/components/ui/separator"

export interface DynamicGraphUserProps {
    id: string,
    name: string,
    SubcommunityMember: {
        subcommunityId: string,
        subcommunityName: string,
        role: "admin" | "member"
    }[]
}

async function getSingleUser(paramsId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: paramsId
            },
            select: {
                id: true,
                name: true,
                userName: true,
                email: true,
                institution: true,
                department: true,
                disciplines: true,
                fields: true,
                interests: true,
                about: true,
                SubcommunityMember: {
                    select: {
                        role: true,
                        subcommunity: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                Post: {
                    select: {
                        id: true,
                        title: true,
                        content: true
                    }
                }
            }
        })

        return user
    } catch (error) {
        console.log(error)
    }
}


export default async function SingleUsersPage({ params }: { params: { id: string } }) {

    const { id } = await params
    const user = await getSingleUser(id)

    if (!user) {
        return null
    }

    const formattedUser = {
        id: user.id,
        name: user.name,
        SubcommunityMember: user.SubcommunityMember.map((sc) => ({
            subcommunityId: sc.subcommunity.id,
            subcommunityName: sc.subcommunity.name,
            role: sc.role,
        })),
    };

    return (
        <section className="py-8">
            <PageTitle>{user?.name}, AKA @{user.userName}</PageTitle>
            <Separator className="mb-4" />
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <DynamicGraph user={formattedUser as DynamicGraphUserProps} />
        </section>
    )
}


