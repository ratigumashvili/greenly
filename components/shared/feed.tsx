import { prisma } from "@/lib/prisma"

async function getPosts(communityId: string) {
    const data = await prisma.subcommunity.findUnique({
        where: {
            id: communityId
        },
        select: {
            Post: {
                select: {
                    id: true,
                    title: true,
                    // content: true,
                    file: true,
                    imagesUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    author: {
                        select: {
                            id: true,
                            userName: true
                        }
                    }
                }
            }
        }
    })

    return data
}

export async function Feed({ id }: { id: string }) {
    const data = await getPosts(id)
    return (
        <div className="border">
            <pre>
                com id: {JSON.stringify(id, null, 2)}
            </pre>
            <pre>
                posts: {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}