import { PageTitle } from "@/components/shared/page-title";
import { getUserData } from "@/lib/utils";

export default async function Home() {


  const {session, user} = await getUserData()
  return (
    <section className="py-8">
      <PageTitle>Welcome to Greenly – Your Hub for Biodiversity & Ecology!</PageTitle>
      <div className="flex flex-col gap-2">
        <p>Welcome to Greenly, a community-driven platform dedicated to exploring, discussing, and preserving the rich biodiversity of Georgia and the Caucasus region. Whether you're a researcher, a conservationist, or simply a nature enthusiast, Greenly provides a space to connect, share insights, and collaborate on ecological topics that matter.</p>
        <p>Join vibrant discussions on wildlife, conservation, climate change, and environmental research. Engage with fellow members, contribute to knowledge-sharing, and discover new insights about the natural world. From birdwatching and mycology to freshwater ecosystems and endangered species, Greenly is your gateway to meaningful conversations and impactful action.</p>
        <p>Let's work together to protect and celebrate nature! Create or join sub-communities, share your findings, and stay informed about the latest developments in biodiversity and conservation. Welcome to Greenly – where nature and knowledge thrive!</p>
      </div>
    </section>
  );
}
