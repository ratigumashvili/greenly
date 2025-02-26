import { PageTitle } from "@/components/shared/page-title";
import { Tags } from "@/components/shared/tags";
import { Separator } from "@/components/ui/separator";
import { getDataByTag } from "../actions";

export default async function SearchPage({ searchParams, params }: { searchParams: Promise<{ tagName?: string }>; params: Promise<{ id: string }> }) {
    
    const { id } = await params;
    const { tagName } = await searchParams
    const communities = await getDataByTag(tagName)

    return (
        <section className="py-8">
            <PageTitle>Search Greenly</PageTitle>
            <Separator className="mb-4" />
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-10 md:col-span-4 lg:col-span-3">
                    <Tags tagName={tagName} />
                </div>
                <div className="col-span-10 md:col-span-6 lg:col-span-3">
                <h2 className="font-bold text-xl mb-4">Search results</h2>
                    <pre>{JSON.stringify(communities, null, 2)}</pre>
                </div>
            </div>
        </section>
    )
}