
import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { AboutTheCommunity } from "@/components/shared/about-the-community"
import { CreatedAt } from "@/components/shared/created-at"
import { PostGridGallery } from "@/components/shared/post-grid-gallery"
import PostContent from "@/components/shared/feed/post-content"
import { PostCommentSection } from "@/components/comments/post-comment-section";

import { prisma } from "@/lib/prisma"
import { getCommentsForPost } from "@/app/actions"
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

// export default async function SinglePostPage(
//     { 
//         params, 
//         searchParams 
//     }: { 
//         params: { id: string } | Promise<{ id: string }>; 
//         searchParams: Record<string, string | undefined> 
//     }
// ) {
//     const { id } = await params
//     const communityId = (await searchParams).communityId ?? "";

//     const post = await getSinglePost(id)
//     const comments = await getCommentsForPost(id)

//     const {user} = await getUserData(communityId)

//     const userId = user?.id as string
//     const isAdmin = user?.isAdmin as boolean
//     const subAdmin = user?.SubcommunityMember[0]?.role === "admin"

//     if (!post || !id) {
//         return null
//     }

//     return (
//         <section className="py-8">
//             <div className="grid grid-cols-10 gap-4">
//                 <div className="col-span-10 md:col-span-6 lg:col-span-7">
//                     <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
//                     <p className="text-sm">
//                         By: <Link href={`/users/${post.author.id}`} className="text-primary hover:text-primary/90 transition">{post.author.userName}</Link>,
//                         <span className="pl-1"><CreatedAt date={post.createdAt} /></span>, in <Link href={`/g/${post.subcommunity.id}`} className="text-primary hover:text-primary/90 transition">{post.subcommunity.name}</Link>
//                     </p>
//                     <Separator className="my-4" />
//                     <PostContent content={post.content || "{}"} />

//                     {post.imagesUrl.length > 0 && (
//                         <section className="my-4">
//                             <PostGridGallery
//                                 images={post.imagesUrl.map((url) => ({
//                                     src: url,
//                                     width: 1450,
//                                     height: 600,
//                                 }))}
//                             />
//                         </section>
//                     )}

//                     <Separator className="my-8" />

//                         <h2 className="text-xl font-bold">Comments</h2>
//                         <PostCommentSection
//                             postId={id}
//                             communityId={communityId}
//                             initialComments={comments}
//                             isAdmin={isAdmin}
//                             subAdmin={subAdmin}
//                             userId={userId}
//                         />

//                 </div>
//                 <div className="col-span-10 md:col-span-4 lg:col-span-3">
//                     <AboutTheCommunity id={communityId} />
//                 </div>
//             </div>

//         </section>
//     )
// }

export default async function SinglePostPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: Record<string, string | undefined>;
}) {
    const { id } = params; // ✅ No need to await
    const communityId = searchParams?.communityId ?? "";

    const post = await getSinglePost(id);
    const comments = await getCommentsForPost(id);
    const { user } = await getUserData(communityId);

    const userId = user?.id ?? "";
    const isAdmin = user?.isAdmin ?? false;
    const subAdmin = user?.SubcommunityMember?.[0]?.role === "admin";

    if (!post) {
        return null;
    }

    return (
        <section className="py-8">
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-6 lg:col-span-7">
                    <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                    <p className="text-sm">
                        By: <Link href={`/users/${post.author.id}`} className="text-primary hover:text-primary/90 transition">{post.author.userName}</Link>,
                        <span className="pl-1"><CreatedAt date={post.createdAt} /></span>, in <Link href={`/g/${post.subcommunity.id}`} className="text-primary hover:text-primary/90 transition">{post.subcommunity.name}</Link>
                    </p>
                    <Separator className="my-4" />
                    <PostContent content={post.content || "{}"} />

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



