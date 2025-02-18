import { prisma } from "@/lib/prisma"

async function getData(id: string) {
    const data = await prisma.subcommunity.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            User: {
                select: {
                    name: true,
                    email: true
                }
            },
            tags: {
                select: {
                    subcommunityId: true,
                    tag: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            }
        }
    })

    return data
}

export default async function SingleSubCommunityPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const data = await getData(id)
    return (
        <section className="py-8">
            single page <pre>{JSON.stringify(data, null, 2)}</pre>
        </section>
    )
}