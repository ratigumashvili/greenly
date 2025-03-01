import Link from "next/link"
import { SettingsIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AboutTheCommunity } from "@/components/shared/about-the-community"
import { CreatedAt } from "@/components/shared/created-at"
import { PostGridGallery } from "@/components/shared/post-grid-gallery"
import PostContent from "@/components/shared/feed/post-content"
import { PostCommentSection } from "@/components/comments/post-comment-section";
import { BookmarkButton } from "@/components/shared/bookmark-button"
import { UserLocation } from "@/components/shared/feed/user-location"

import { prisma } from "@/lib/prisma"
import { getCommentsForPost, isPostBookmarked } from "@/app/actions"
import { getUserData } from "@/lib/utils"

async function getSinglePost(postId: string) {
    const data = await prisma.post.findFirst({
        where: {
            id: postId
        },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            title: true,
            content: true,
            file: true,
            imagesUrl: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    userName: true
                }
            },
            vote: {
                select: {
                    id: true,
                    voteType: true,
                    User: {
                        select: {
                            id: true
                        }
                    },
                }
            },
            subcommunity: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return data
}

export default async function SinglePostPage({ searchParams, params }: { searchParams: Promise<{ communityId?: string }>; params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { communityId } = await searchParams

    const post = await getSinglePost(id);
    const comments = await getCommentsForPost(id);
    const { user } = await getUserData(communityId);

    const userId = user?.id ?? "";
    const isAdmin = user?.isAdmin ?? false;
    const subAdmin = user?.SubcommunityMember?.[0]?.role === "admin";

    const isBookmarked = await isPostBookmarked(post.id, userId)

    if (!post) return null;

    return (
        <section className="py-8">
            <div className="grid grid-cols-10 gap-6">
                <div className="col-span-10 md:col-span-6 lg:col-span-7">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-2xl font-bold">{post.title}</h2>
                        <div>
                            <BookmarkButton postId={post.id} userId={userId} isBookmarked={isBookmarked} />
                            {userId === post.author.id && (
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`/g/posts/${post.id}/edit`}>
                                        <SettingsIcon />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="text-sm">
                        By: <Link href={`/users/${post.author.id}`} className="text-primary hover:text-primary/90 transition">{post.author.userName}</Link>,
                        <span className="pl-1"><CreatedAt date={post.createdAt} /></span>, in <Link href={`/g/${post.subcommunity.id}`} className="text-primary hover:text-primary/90 transition">{post.subcommunity.name}</Link>
                    </p>
                    <Separator className="my-4" />
                    <PostContent content={post.content || ""} />

                    {post.location && (
                        <>
                            <Separator className="my-4" />
                            <UserLocation address={post.location} postId={post.id} />
                        </>
                    )}

                    {post.imagesUrl.length > 0 && (
                        <section className="my-4">
                            <PostGridGallery
                                images={post.imagesUrl.map((url) => ({
                                    src: url,
                                    width: 1450,
                                    height: 600,
                                }))}
                            />
                        </section>
                    )}

                    <Separator className="my-8" />

                    <h2 className="text-xl font-bold">Comments</h2>
                    <PostCommentSection
                        postId={id}
                        communityId={communityId}
                        initialComments={comments}
                        isAdmin={isAdmin}
                        subAdmin={subAdmin}
                        userId={userId}
                    />
                </div>
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                    <AboutTheCommunity id={communityId} />
                </div>
            </div>
        </section>
    );
}