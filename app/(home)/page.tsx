import { getUserData } from "@/lib/utils";

export default async function Home() {


  const {session, user} = await getUserData()
  return (
    <section>
      <pre>
        {JSON.stringify(session?.user?.email, null, 2)}
      </pre>
    </section>
  );
}
