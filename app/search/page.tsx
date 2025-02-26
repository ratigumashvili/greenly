import { PageTitle } from "@/components/shared/page-title";
import { Tags } from "@/components/shared/tags";
import { Separator } from "@/components/ui/separator";
import { SearchFormsTabs } from "@/components/forms/tabs/search-forms-tabs";

import { getAllTags, getCommunitiesByName, getDataByTag, getUsersByName } from "@/app/actions";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{
        tagName?: string;
        communityName?: string,
        userName?: string
    }>
}) {

    const tags = await getAllTags()
    const { tagName, communityName, userName } = await searchParams
    const resultByCommunityName = await getCommunitiesByName(communityName)
    const resultByUserName = await getUsersByName(userName)
    const resultByCommunityTag = await getDataByTag(tagName)

    return (
        <section className="py-8">
            <PageTitle>Search Greenly by</PageTitle>
            <Separator className="mb-4" />
            {/* <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                    <Tags tagName={tagName} />
                </div>
                <div className="col-span-10 md:col-span-6 lg:col-span-3">
                <h2 className="font-bold text-xl mb-4">Search results</h2>
                    <pre>by tags: {JSON.stringify(resultByCommunityTag, null, 2)}</pre>
                    <pre>by name: {JSON.stringify(resultByCommunityName, null, 2)}</pre>
                </div>
            </div> */}
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                    <SearchFormsTabs tags={tags} tagName={tagName} />
                </div>
                <div className="col-span-10 md:col-span-6 lg:col-span-3">
                    <pre>by tags: {JSON.stringify(resultByCommunityTag, null, 2)}</pre>
                    <pre>by name: {JSON.stringify(resultByCommunityName, null, 2)}</pre>
                    <pre>by user {JSON.stringify(resultByUserName, null, 2)}</pre>
                </div>
            </div>
        </section>
    )
}