import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getUserData } from "@/lib/utils"

async function getData(id: string) {
    const data = await prisma.subcommunity.update({
        where: { id },
        data: {
            views: { increment: 1 }
        },
        select: {
            User: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    userName: true
                }
            },
            members: { select: { userId: true } }
        }
    });

    return data;
}

export default async function CreatePost({ params }: { params: { id: string } }) {
    const { id } = await params
    const data = await getData(id)
    const { session, user } = await getUserData()

    const isMember = user ? data.members.some(member => member.userId === user.id) : false;

    if(!session || !isMember) {
        return redirect(`/g/${id}`)
    }

    return (
        <section className="py-8">{JSON.stringify(isMember, null, 2)}</section>
    )
}