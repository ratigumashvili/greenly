import { prisma } from "@/lib/prisma"

import { PageTitle } from "@/components/shared/page-title"
import { Pagination } from "@/components/shared/pagination"

import { COMMUNITIES_DISPLAY_LIMIT } from "@/lib/constants"
import { CommunityCard } from "@/components/shared/community-card"

async function getData(page: number = 1, limit: number = COMMUNITIES_DISPLAY_LIMIT) {

    const offset = (page - 1) * limit

    const communities = await prisma.subcommunity.findMany({
        skip: offset,
        take: limit,
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
    })

    const totalCommunities: number = await prisma.subcommunity.count();

    return { communities, totalCommunities }
}

export default async function Communities({ searchParams }: { searchParams: Promise<{ page?: string }> }) {

    const { page } = await searchParams
    const currentPage = page ? parseInt(page, 10) || 1 : 1;

    const { communities, totalCommunities } = await getData(currentPage);

    const totalPages = Math.ceil(totalCommunities / COMMUNITIES_DISPLAY_LIMIT);

    return (
        <section className="py-8">
            <PageTitle>Explore Communities</PageTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities && communities.length !== 0 && communities.map((item) => {
                    return (
                        <CommunityCard key={item.id} {...item} />
                    )
                })}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />

        </section>
    )
}

