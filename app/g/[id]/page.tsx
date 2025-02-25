import { PageTitle } from "@/components/shared/page-title"
import { Feed } from "@/components/shared/feed/feed"
import { AboutTheCommunity } from "@/components/shared/about-the-community"

import { prisma } from "@/lib/prisma"

async function getData(id: string) {
    const data = await prisma.subcommunity.update({
        where: { id },
        data: {
            views: { increment: 1 }
        },
        select: {
            id: true,
            name: true
        }
    });

    return data;
}

export default async function SingleSubCommunityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getData(id)
    

    if (!data) {
        return null
    }

    return (
        <section className="py-8">
            <PageTitle>{data.name}</PageTitle>
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-6 lg:col-span-7">
                    <Feed id={id} />
                </div>
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                    <AboutTheCommunity id={id} />
                </div>
            </div>
        </section>
    )
}