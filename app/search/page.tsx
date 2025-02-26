import { PageTitle } from "@/components/shared/page-title";
import { Separator } from "@/components/ui/separator";
import { SearchFormsTabs } from "@/components/forms/tabs/search-forms-tabs";

import { getAllTags, getCommunitiesByName, getDataByTag, getUsersByName } from "@/app/actions";
import Link from "next/link";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{
        tagName?: string;
        communityName?: string,
        userName?: string
    }>
}) {

    const { tagName, communityName, userName } = await searchParams

    const tags = await getAllTags()

    const resultByCommunityName = await getCommunitiesByName(communityName)
    const resultByUserName = await getUsersByName(userName)
    const resultByCommunityTag = await getDataByTag(tagName)

    return (
        <section className="py-8">
            <PageTitle>Search Greenly by</PageTitle>
            <Separator className="mb-4" />

            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                    <SearchFormsTabs tags={tags} tagName={tagName} />
                </div>
                <div className="col-span-10 md:col-span-6 lg:col-span-3">

                    {resultByCommunityName && resultByCommunityName.length > 0 &&
                        resultByCommunityName.map((item) => (
                            <Link key={item.id} href={`/g/${item.id}`} className="block">{item.name}</Link>
                        )
                        )}

                    {resultByCommunityTag && resultByCommunityTag.length > 0 &&
                        resultByCommunityTag.map((item) => (
                            <Link key={item.id} href={`/g/${item.id}`} className="block">{item.name}</Link>
                        )
                        )}

                    {resultByUserName && resultByUserName.length > 0 &&
                        resultByUserName.map((item) => (
                            <Link key={item.userName} href={`/users/${item.id}`} className="block">{item.name}, AKA @{item.userName}</Link>
                        )
                        )}

                </div>
            </div>

        </section>
    )
}