import { getUserData } from "@/lib/utils";



export default async function CreatePage () {
    

    const {user} = await getUserData()
    return (
        <section className="py-8">
            return <pre>{JSON.stringify(user, null, 2)}</pre>;
        </section>
    )
}