import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get("communityId");

    if (!communityId) {
        return NextResponse.json({ error: "Community ID is required" }, { status: 400 });
    }

    try {
        const members = await prisma.subcommunityMember.findMany({
            where: { subcommunityId: communityId },
            select: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        return NextResponse.json({ members: members.map((m) => m.user) });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
}
