import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma"
import { getUserData } from "@/lib/utils";

import { EditPostForm } from "@/components/forms/edit-post-form";

export default async function SinglePostEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const post = await prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            subcommunityId: true,
            imagesUrl: true,
            file: true,
            location: true
        }
    });


    if (!post) return notFound()

    const { user } = await getUserData()

    if (!user || user.id !== post.authorId) {
        return redirect(`/g/posts/${id}?communityId=${post.subcommunityId}`)
    }

    return (
        <section className="py-8">
            <EditPostForm post={{
                ...post,
                imagesUrl: post.imagesUrl ?? [],
                file: post.file ?? null,
                location: post.location ?? ""
            }} />
        </section>
    )
}