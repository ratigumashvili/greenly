import { PageTitle } from "@/components/shared/page-title";

import { prisma } from "@/lib/prisma";

import { getCoordinates } from "@/lib/utils";

async function getPostsGroupedByLocation() {
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

    const locations = uniqueLocations.map((loc) => loc.location)

    const locationData = await Promise.all(
        locations.map(async (location) => {
            const coordinates = await getCoordinates(location)
            return {location, coordinates}
        })
    )

    const postsByLocation = await prisma.post.findMany({
        where: {
            location: {
                in: locations
            }
        },
        select: {
            title: true,
            id: true,
            subcommunityId: true,
            location: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const groupedPosts = locationData.map(({location, coordinates}) => ({
        location: {
            title: location,
            coordinates: [coordinates.latitude, coordinates.longitude]
        },
        posts: postsByLocation.filter(post => post.location === location) 
    }))

    return groupedPosts
}

export default async function GlobalMap() {
    const data = await getPostsGroupedByLocation()
    return (
        <section className="py-8">
            <PageTitle>Map</PageTitle>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </section>
    )
}