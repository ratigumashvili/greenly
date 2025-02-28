import { CommunityCard } from "@/components/shared/community-card";

import { prisma } from "@/lib/prisma";

async function getMostViewedCommunities(limit: number = 3) {
    const communities = await prisma.subcommunity.findMany({
        take: limit,
        orderBy: {
            views: 'desc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            views: true,
            createdAt: true,
            User: {
                select: {
                    userName: true
                }
            }
        }
    });

    return communities;
}

export async function MostViewdCommunities() {
    
    const data = await getMostViewedCommunities()

    if(data.length === 0) return null
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data && data?.length !==0 && (
                data.map((item) => (
                    <CommunityCard key={item.id} {...item} />
                ))
            )}
        </div>
    )
}