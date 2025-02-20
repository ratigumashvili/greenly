import { SubCommunityForm } from "@/components/forms/subcommunity-form"
import { PageTitle } from "@/components/shared/page-title";
import { NotLoggedIn } from "@/components/shared/not-logged-in";
import { SubcommunityMemberList } from "@/components/shared/subcommunity-member-list";
import { DeleteCommunityForm } from "@/components/forms/delete-community-form";
import { Separator } from "@/components/ui/separator";

import { getUserData } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function EditSubCommunityPage({ searchParams }: { searchParams: { recordId: string } }) {
    const { session, user } = await getUserData()
    const { recordId } = await searchParams

    if (!session || !user) {
        return <NotLoggedIn />
    }

    if (!recordId) {
        return <div className="py-8">No subcommunity ID provided.</div>;
    }

    const data = await prisma.subcommunity.findUnique({
        where: {
            id: recordId
        },
        select: {
            id: true,
            name: true,
            description: true,
            User: {
                select: {
                    id: true,
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
            },
            members: { 
                select: { 
                    userId: true,
                } 
            }
        }
    })

    if (!data) {
        return <div className="py-8">Subcommunity not found.</div>;
    }

    const formattedData = data
        ? {
            id: data.id,
            name: data.name,
            description: data.description ?? "",
            tags: data.tags.map(({ tag }) => ({
                id: tag.id,
                name: tag.name,
            })),
        }
        : undefined;

        const isCreator = user?.email === data.User?.email;
        const isMember = user ? data.members.some(member => member.userId === user.id) : false;

        if(!isCreator) {
            return <div className="py-8">You don't have permission to update this record.</div>;
        }

    return (
        <section className="py-8">
            <PageTitle>Edit Community</PageTitle>
            <SubCommunityForm mode="edit" initialData={formattedData} />
            <Separator className="my-4" />
            <SubcommunityMemberList subcommunityId={recordId} isMember={isMember} />
            <Separator className="my-4" />
            <DeleteCommunityForm subId={recordId} />
        </section>
    )
}