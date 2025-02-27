import { notFound, redirect } from "next/navigation";

import { EditPostForm } from "@/components/forms/edit-form-post";

import { prisma } from "@/lib/prisma"
import { getUserData } from "@/lib/utils";

export default async function SinglePostEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const post = await prisma.post.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            subcommunityId: true,
            imagesUrl: true
        }
    })

    if (!post) return notFound()

    const { user } = await getUserData()

    if(!user || user.id !== post.authorId) {
        return redirect(`/g/posts/${id}?communityId=${post.subcommunityId}`)
    }

    return (
        <section className="py-8">
            <EditPostForm post={{ ...post, imagesUrl: post.imagesUrl || [] }} />
        </section>
    )
}