import { auth } from "@/lib/utils";

export default async function Home() {
  const session = await auth()
  return (
    <section>
        <pre>
          {JSON.stringify(session?.user, null, 2)}
        </pre>
    </section>
  );
}
