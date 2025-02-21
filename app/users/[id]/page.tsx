import { PageTitle } from "@/components/shared/page-title"
import { prisma } from "@/lib/prisma"

async function getSingleUser(paramsId: string) {
    try {
        const users = await prisma.user.findUnique({
            where: {
                id: paramsId
            },
            select: {
                id: true,
                name: true,
                userName: true,
                email: true,
                SubcommunityMember: {
                    select: {
                        role: true,
                        subcommunity: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
            }
        })

        return users
    } catch (error) {
        console.log(error)
    }
}


export default async function SingleUsersPage({ params }: { params: { id: string } }) {

    const { id } = await params
    const user = await getSingleUser(id)

    if(!user) {
        return null
    }

    return (
        <section className="py-8">
            <PageTitle>{user?.name}, AKA @{user.userName}</PageTitle>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
        </section>
    )
}