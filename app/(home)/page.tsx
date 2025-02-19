import { MostViewdCommunities } from "@/components/shared/most-viewed-communities";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { getUserData } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {

  return (
    <>
      <section className="py-8">
        <PageTitle>Welcome to Greenly – Your Hub for Biodiversity & Ecology!</PageTitle>
        <div className="flex flex-col gap-2">
          <p>Welcome to Greenly, a community-driven platform dedicated to exploring, discussing, and preserving the rich biodiversity of Georgia and the Caucasus region. Whether you're a researcher, a conservationist, or simply a nature enthusiast, Greenly provides a space to connect, share insights, and collaborate on ecological topics that matter.</p>
          <p>Join vibrant discussions on wildlife, conservation, climate change, and environmental research. Engage with fellow members, contribute to knowledge-sharing, and discover new insights about the natural world. From birdwatching and mycology to freshwater ecosystems and endangered species, Greenly is your gateway to meaningful conversations and impactful action.</p>
          <p>Let's work together to protect and celebrate nature! Create or join sub-communities, share your findings, and stay informed about the latest developments in biodiversity and conservation. Welcome to Greenly – where nature and knowledge thrive!</p>
        </div>
      </section>
      <section>
        <h2 className="font-bold tracking-tighter text-xl mb-4">Most Popular Communities</h2>
        <MostViewdCommunities />
        <div className="flex items-center justify-center gap-3 my-6">
          <Button asChild size="lg">
            <Link href={"/g"}>View all</Link>
          </Button>
          <span>OR</span>
          <Button asChild size="lg">
            <Link href={"/g/create"}>Create one</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
