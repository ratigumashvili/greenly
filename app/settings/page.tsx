import { UpdateUsernameForm } from "@/components/forms/update-username-form"
import { NotLoggedIn } from "@/components/shared/not-logged-in"

import { getUserData } from "@/lib/utils"

export default async function SettingsPage() {

    const {session, user} = await getUserData()

    if (!session) {
        return <NotLoggedIn />
    }

    return (
        <section className="py-8">
            <UpdateUsernameForm username={user?.userName ?? ""} />
        </section>
    )
}