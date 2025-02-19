import Link from "next/link"
import { prisma } from "@/lib/prisma"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import { PageTitle } from "@/components/shared/page-title"
import {CreatedAt} from "@/components/shared/created-at"

async function getData() {
    const data = await prisma.subcommunity.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            User: {
                select: {
                    userName: true
                }
            }
        }
    })
    return data
}

export default async function Communities() {
    const communities = await getData()
    return (
        <section className="py-8">
            <PageTitle>Explore Communities</PageTitle>
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities && communities.length !== 0 && communities.map((item) => {
                    return (
                        <Card key={item.id}>
                            <CardHeader>
                                <CardTitle><h2 className="line-clamp-1">{item.name}</h2></CardTitle>
                            </CardHeader>
                            <CardDescription>
                                <CardContent>
                                    <p className="line-clamp-3">{item.description}</p>
                                </CardContent>
                            </CardDescription>
                            <CardFooter className="flex flex-col gap-4">
                                <div className="text-sm w-full flex flex-col md:flex-row md:justify-between items-start gap-2 ">
                                    <p>Created by: <span className="font-bold">@{item?.User?.userName}</span></p>
                                    <p><CreatedAt date={item.createdAt} /></p>
                                </div>
                                <Button asChild>
                                    <Link href={`/g/${item.id}`} className="w-full">View group</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}

