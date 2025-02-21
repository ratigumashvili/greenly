import dynamic from "next/dynamic"

import { prisma } from "@/lib/prisma"

import { PageTitle } from "@/components/shared/page-title"
import DynamicGraph from "./graph"

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

    if(!user) {
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
            <pre>
                {JSON.stringify(formattedUser, null, 2)}
            </pre>
            <DynamicGraph user={formattedUser as DynamicGraphUserProps} />
        </section>
    )
}


