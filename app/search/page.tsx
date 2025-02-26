import { PageTitle } from "@/components/shared/page-title";
import { Separator } from "@/components/ui/separator";
import { SearchFormsTabs } from "@/components/forms/tabs/search-forms-tabs";

import { getAllTags, getCommunitiesByName, getDataByTag, getPostsByTitle, getUsersByName } from "@/app/actions";
import Link from "next/link";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{
        tagName?: string;
        communityName?: string,
        userName?: string,
        postTitle?: string
    }>
}) {

    const { tagName, communityName, userName, postTitle } = await searchParams

    const tags = await getAllTags()

    const resultByCommunityName = await getCommunitiesByName(communityName)
    const resultByUserName = await getUsersByName(userName)
    const resultByPostTitle = await getPostsByTitle(postTitle)
    const resultByCommunityTag = await getDataByTag(tagName)

    return (
        <section className="py-8">
            <PageTitle>Search Greenly by</PageTitle>
            <Separator className="mb-4" />

            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-5 lg:col-span-4">
                    <SearchFormsTabs tags={tags} tagName={tagName} />
                </div>
                <div className="col-span-10 md:col-span-5 lg:col-span-6">

                    {resultByCommunityName && resultByCommunityName.length > 0 &&
                        resultByCommunityName.map((item) => (
                            <div key={item.id} className="border-b last:border-b-0 w-full mb-2 pb-4">
                                <Link href={`/g/${item.id}`} className="block text-xl">{item.name}</Link>
                            </div>
                        )
                        )}

                    {resultByCommunityTag && resultByCommunityTag.length > 0 &&
                        resultByCommunityTag.map((item) => (
                            <div key={item.id} className="border-b last:border-b-0 w-full mb-2 pb-4">
                                <Link href={`/g/${item.id}`} className="block text-xl">{item.name}</Link>
                            </div>
                        )
                        )}

                    {resultByUserName && resultByUserName.length > 0 &&
                        resultByUserName.map((item) => (
                            <div key={item.userName} className="border-b last:border-b-0 w-full mb-2 pb-4">
                                <Link href={`/users/${item.id}`} className="block text-xl">{item.name}, AKA @{item.userName}</Link>
                            </div>
                        )
                        )}


                    {resultByPostTitle && resultByPostTitle.length > 0 &&
                        resultByPostTitle.map((item) => (
                            <div key={item.id} className="border-b last:border-b-0 w-full mb-2 pb-4">
                                <Link href={`/g/posts/${item.id}?communityId=${item.subcommunityId}`} className="block text-xl">
                                    {item.title}
                                </Link>
                                By: <Link href={`/users/${item.author.id}`} className="text-primary text-sm">{item.author.name}</Link> AKA @{item.author.userName}
                            </div>
                        ))}

                </div>
            </div>

        </section>
    )
}