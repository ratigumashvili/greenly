import { SubCommunityForm } from "@/components/forms/subcommunity-form"
import { PageTitle } from "@/components/shared/page-title";
import { NotLoggedIn } from "@/components/shared/not-logged-in";

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

        if(user?.id !== data.User?.id) {
            return <div className="py-8">You don't have permission to update this record.</div>;
        }

    return (
        <section className="py-8">
            <PageTitle>Edit Community</PageTitle>
            <SubCommunityForm mode="edit" initialData={formattedData} />
        </section>
    )
}