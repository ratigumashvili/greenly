import Link from "next/link"
import { Separator } from "@/components/ui/separator"

import { AboutTheCommunity } from "@/components/shared/about-the-community"
import { CreatedAt } from "@/components/shared/created-at"

import { prisma } from "@/lib/prisma"

async function getSinglePost(postId: string) {
    const data = await prisma.post.findFirst({
        where: {
            id: postId
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
            }
        }
    })

    return data
}

export default async function SinglePostPage ({params} : {params: {id: string}}) {
    const {id} = await params
    const post = await getSinglePost(id)

    if(!post || !id) {
        return null
    }
    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <p className="text-sm">
                By: <Link href={`/users/${post.author.id}`} className="text-primary hover:text-primary/90 transition">{post.author.userName}</Link>,
                <span className="pl-1"><CreatedAt date={post.createdAt} /></span>
            </p>
            <Separator className="my-4" />
            
            <AboutTheCommunity id={id} />
        </section>
    )
}