import { prisma } from "@/lib/prisma"

import { PageTitle } from "@/components/shared/page-title"
import { Separator } from "@/components/ui/separator"

import DynamicGraph from "@/app/users/[id]/graph"
import { UsersPosts } from "@/app/users/[id]/posts"

export interface DynamicGraphUserProps {
    id: string,
    name: string,
    SubcommunityMember: {
        subcommunityId: string,
        subcommunityName: string,
        role: "admin" | "member",
    }[],
    Posts: {
        postTitle: string,
        postId: string
        subcommunityId: string
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
                    orderBy: {
                        createdAt: "desc"
                    },
                    select: {
                        id: true,
                        title: true,
                        subcommunityId: true
                    }
                }
            }
        })

        return user
    } catch (error) {
        console.log(error)
    }
}


export default async function SingleUsersPage({ params }: { params: Promise<{ id: string }> }) {

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
        Posts: user.Post.map((post) => ({
            postTitle: post.title,
            postId: post.id,
            subcommunityId: post.subcommunityId
        }))
    };

    return (
        <section className="py-8">
            <PageTitle>{user?.name}, AKA @{user.userName}</PageTitle>
            <Separator className="mb-4" />

            <section className="mb-10">
                <dl className="data-list">
                    <dt>Name:</dt>
                    <dd>{user?.name}</dd>
                    <dt>Username:</dt>
                    <dd>{user?.userName}</dd>
                    <dt>Email:</dt>
                    <dd>{user.email}</dd>
                    <dt>institution:</dt>
                    <dd>{user?.institution}</dd>
                    <dt>Department:</dt>
                    <dd>{user?.department}</dd>
                    <dt>Disciplines:</dt>
                    <dd>{user?.disciplines}</dd>
                    <dt>Fields:</dt>
                    <dd>{user?.fields}</dd>
                    <dt>Interests:</dt>
                    <dd>{user?.interests}</dd>
                    <dt>About:</dt>
                    <dd>{user?.about}</dd>
                </dl>
            </section>

            <UsersPosts user={formattedUser as DynamicGraphUserProps} />
            <DynamicGraph user={formattedUser as DynamicGraphUserProps} />
        </section>
    )
}


