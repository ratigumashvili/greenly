import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get("location")

    if (!location) {
        return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                location
            },
            select: {
                id: true,
                title: true,
                subcommunityId: true,
                createdAt: true,
                author: {
                    select: {
                        userName: true,
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.log("Error fetching posts: ", error)
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}