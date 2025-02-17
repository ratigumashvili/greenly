import { auth, authSession } from "@/lib/auth";

export default async function Home() {
  const session = await authSession()
  if (!session) {
    return null;
  }
  return (
    <section>
      <pre>
        session: {JSON.stringify(session?.user, null, 2)}
      </pre>
    </section>
  );
}
