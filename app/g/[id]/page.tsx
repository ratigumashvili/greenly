// import Link from "next/link"
// import { SettingsIcon } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/shared/page-title"
// import { CreatedAt } from "@/components/shared/created-at"
// import { SubcommunityMemberList } from "@/components/shared/subcommunity-member-list"
import { Feed } from "@/components/shared/feed/feed"

import { prisma } from "@/lib/prisma"
// import { getUserData } from "@/lib/utils"
// import { JoinCommunityButton } from "@/components/forms/join-community-button"
import { AboutTheCommunity } from "@/components/shared/about-the-community"



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


export default async function SingleSubCommunityPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const data = await getData(id)
    // const { session, user } = await getUserData(id)

    // const isMember = user ? data.members.some(member => member.userId === user.id) : false;
    // const isCreator = user?.email === data.User?.email;
    // const isAdmin = user?.SubcommunityMember[0]?.role === "admin"

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