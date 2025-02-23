import Link from "next/link"
import { MessageCircleIcon, ShareIcon } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatedAt } from "@/components/shared/created-at"

import { prisma } from "@/lib/prisma"

async function getCommunityPosts(communityId: string) {
    const data = await prisma.subcommunity.findUnique({
        where: {
            id: communityId
        },
        select: {
            Post: {
                select: {
                    id: true,
                    title: true,
                    // content: true,
                    // file: true,
                    // imagesUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            id: true,
                            userName: true
                        }
                    }
                }
            }
        }
    })

    return data
}

export async function Feed({ id }: { id: string }) {
    const post = await getCommunityPosts(id)

    if (!post || post.Post.length === 0) {
        return <h2 className="text-xl font-bold">No posts found</h2>
    }
    return (
        <div className="flex flex-col gap-4">
            {post.Post.map((item) => (
                <Card key={item.id}>
                    <CardHeader>
                        <CardTitle
                            className="text-xl">
                            <Link href={`/g/posts/${item.id}`} className="text-primary">{item.title}</Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        content
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <p>Author:
                                    <Link href={`/users/${item.author.id}`} className="text-primary hover:text-primary/90 transition">
                                        <span className="pl-1">@{item.author.userName}</span>
                                    </Link>,
                                </p>
                                <CreatedAt date={item.createdAt} />
                            </div>
                            <div className="flex items-center gap-2">
                                <ShareIcon className="w-4 h-4 text-muted-foreground" />
                                <MessageCircleIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}