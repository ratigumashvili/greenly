import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/components/shared/page-title";

import { prisma } from "@/lib/prisma";
import { getUserData } from "@/lib/utils"
import { summaryOfRules } from "@/lib/constants";
import Link from "next/link";
import Tiptap from "@/components/shared/tip-tap";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/actions";
import { CreatePostForm } from "@/components/forms/create-post-form";

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

    if (!session || !isMember) {
        return redirect(`/g/${id}`)
    }

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-4">
                <PageTitle classNames="mb-0">Create a new post</PageTitle>
                <Link href={`/g/${id}`}>Go back</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <h2 className="text-xl">Summary of Rules</h2>
                            </CardTitle>
                            <CardDescription>
                                Please, follow this rules before posting your content.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal pl-3">
                                {summaryOfRules.map((item) => (
                                    <li key={item.title} className="mb-3">
                                        <span className="font-bold">{item.title}</span> - {item.description}
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-5">
                    <CreatePostForm id={id} />
                </div>
            </div>
        </section>
    )
}