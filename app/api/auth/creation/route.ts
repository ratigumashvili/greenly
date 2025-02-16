import { NextResponse } from "next/server";
import { generateUsername } from "unique-username-generator";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/utils";

export async function GET() {
    const session = await auth()

    if (!session || !session.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    let dbUser = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
    });

    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                name: session.user.name ?? "Anonymous",
                email: session.user.email,
                userName: generateUsername("-", 3, 8),
            },
        });
    }

    return NextResponse.redirect(process.env.NEXT_PUBLIC_API_URL!)
}