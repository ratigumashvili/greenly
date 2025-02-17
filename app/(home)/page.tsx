import { getUserData } from "@/lib/utils";

export default async function Home() {


  const data = await getUserData()
  return (
    <section>
      <pre>
        session: {JSON.stringify(data?.user, null, 2)}
      </pre>
    </section>
  );
}
