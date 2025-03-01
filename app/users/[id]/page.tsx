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
        subcommunityId: string,
        createdAt: Date,
        subcommunity: {
            id: string,
            name: string,
        }
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
                        subcommunityId: true,
                        createdAt: true,
                        subcommunity: {
                            select: {
                                name: true,
                                id: true
                            }
                        }
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
            subcommunityId: post.subcommunityId,
            subcommunity: post.subcommunity,
            createdAt: post.createdAt,
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
                    {user?.institution && (
                        <>
                            <dt>institution:</dt>
                            <dd>{user?.institution}</dd>
                        </>
                    )}
                    {user?.department && (
                        <>
                            <dt>Department:</dt>
                            <dd>{user?.department}</dd>
                        </>
                    )}
                    {user?.disciplines && (
                        <>
                            <dt>Disciplines:</dt>
                            <dd>{user?.disciplines}</dd>
                        </>
                    )}
                    {user?.fields && (
                        <>
                            <dt>Fields:</dt>
                            <dd>{user?.fields}</dd>
                        </>
                    )}
                    {user?.interests && (
                        <>
                            <dt>Interests:</dt>
                            <dd>{user?.interests}</dd>
                        </>
                    )}
                    {user?.about && (
                        <>
                            <dt>About:</dt>
                            <dd>{user?.about}</dd>
                        </>
                    )}
                </dl>
            </section>

            <UsersPosts user={formattedUser as DynamicGraphUserProps} />
            <DynamicGraph user={formattedUser as DynamicGraphUserProps} />
        </section>
    )
}


