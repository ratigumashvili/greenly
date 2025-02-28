import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCoordinates } from "@/lib/utils";

export async function GET() {
    try {
        const uniqueLocations = await prisma.post.findMany({
            where: {
                location: {
                    not: null
                }
            },
            select: {
                location: true
            },
            distinct: ["location"]
        })

        const locationData = await Promise.all(
            uniqueLocations.map(async ({ location }) => {
                const coordinates = await getCoordinates(location)
                return { location, coordinates }
            })
        )

        return NextResponse.json(locationData)
    } catch (error) {
        console.log("Error fetching locations ", error)
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
    }
}