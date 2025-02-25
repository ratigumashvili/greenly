import { SubCommunityForm } from "@/components/forms/subcommunity-form"
import { PageTitle } from "@/components/shared/page-title";
import { Separator } from "@/components/ui/separator";
import { NotLoggedIn } from "@/components/shared/not-logged-in";

import { getUserData } from "@/lib/utils";

export default async function CreateSubCommunityPage () {
    const {session, user} = await getUserData()

    if(!session || !user) {
        return <NotLoggedIn />
    }

    return (
        <section className="py-8">
            <PageTitle>Create Community</PageTitle>
            <p>Do you have a passion for a specific topic or research field? Start your own subcommunity and bring like-minded individuals together! Whether it&apos;s about biodiversity, conservation, or a niche scientific topic, your subcommunity can become a hub for sharing knowledge, discussing ideas, and fostering collaborations. Lead the conversation, build your network, and create a space where your passion thrives. Start your subcommunity today and inspire meaningful discussions within our growing ecosystem! </p>
            <Separator className="my-8" />
            <SubCommunityForm mode="create" />
        </section>
    )
}