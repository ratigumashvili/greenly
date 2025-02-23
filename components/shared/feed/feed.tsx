import Link from "next/link"
import { MessageCircleIcon, ShareIcon } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatedAt } from "@/components/shared/created-at"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { handleVote } from "@/app/actions"

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

interface FeedProps {
    id: string,
}

export async function Feed({ id }: FeedProps) {
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
                            <Link href={`/g/posts/${item.id}?communityId=${id}`} className="text-primary">{item.title}</Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        content
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <p>Author:
                                    <Link href={`/users/${item.author.id}`} className="text-primary hover:text-primary/90 transition">
                                        <span className="pl-1">@{item.author.userName}</span>
                                    </Link>,
                                </p>
                                <CreatedAt date={item.createdAt} />
                            </div>
                            <div className="flex items-center gap-1">
                                <form action={handleVote}>
                                    <input type="hidden" name="postId" value={item.id} />
                                    <input type="hidden" name="direction" value="UP" />
                                <Button variant="ghost" size="icon">
                                    up
                                </Button>    
                                </form>
                                <Button variant="ghost" size="icon">
                                    <ShareIcon className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MessageCircleIcon className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}