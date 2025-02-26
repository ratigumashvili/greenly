import Link from "next/link";
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";

import { CreatedAt } from "@/components/shared/created-at";
import { NotLoggedIn } from "@/components/shared/not-logged-in";
import { PageTitle } from "@/components/shared/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { prisma } from "@/lib/prisma";
import { getUserData } from "@/lib/utils";
import { removeBookmark, isPostBookmarked } from "@/app/actions";
import { Button } from "@/components/ui/button";

// async function getBookmarkedPosts(userId: string) {
//     return await prisma.bookmark.findMany({
//         where: {
//             userId
//         },
//         include: {
//             post: {
//                 select: {
//                     id: true,
//                     title: true,
//                     createdAt: true,
//                     author: {
//                         select: {
//                             id: true,
//                             name: true,
//                             userName: true
//                         }
//                     },
//                     subcommunity: {
//                         select: {
//                             id: true,
//                             name: true
//                         }
//                     }
//                 }
//             }
//         }
//     })

// }

async function getBookmarkedPosts(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    author: {
                        select: { id: true, name: true, userName: true }
                    },
                    subcommunity: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });

    // Fetch bookmark status in parallel using Promise.all
    const bookmarksWithStatus = await Promise.all(
        bookmarks.map(async (bookmark) => ({
            ...bookmark,
            isBookmarked: await isPostBookmarked(bookmark.post.id, userId)
        }))
    );

    return bookmarksWithStatus;
}

export default async function BookmarksPage() {

    const { user } = await getUserData()

    if (!user) return <NotLoggedIn />

    const bookmarkedPosts = await getBookmarkedPosts(user.id)

    return (
        <section className="py-8">
            <PageTitle>Bookmarks</PageTitle>
            <Separator className="mb-4" />

            {bookmarkedPosts.length === 0 && <h2 className="text-lg">You have no bookmarks yet</h2>}

            {bookmarkedPosts.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedPosts.map((item) => {
                        return (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <Link className="underline" href={`/g/posts/${item.post.id}?communityId=${item.post.subcommunity.id}`}>
                                            <h2 className="line-clamp-1 text-xl">{item.post.title}</h2>
                                        </Link>
                                        <form action={async () => {
                                            "use server"
                                            await removeBookmark(user.id, item.post.id)
                                        }}>
                                            <Button
                                                variant="ghost" size="icon"
                                            >
                                                {item.isBookmarked ? <BookmarkCheckIcon /> : <BookmarkIcon />}
                                            </Button>
                                        </form>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-base text-muted-foreground">
                                        Created: <CreatedAt date={item.post.createdAt} />,
                                        by: {item.post.author.name},
                                        AKA @<Link className="text-primary hover:text-primary/90 transition" href={`/users/${item.post.author.id}`}>
                                            {item.post.author.userName}
                                        </Link>
                                    </div>
                                    <div className="text-base">
                                        Posted in: <Link className="text-primary hover:text-primary/90 transition" href={`/g/${item.post.subcommunity.id}`}>
                                            {item.post.subcommunity.name}</Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </section>
    )
}