import { UpdateSettings } from "@/components/forms/update-username-form"
import { NotLoggedIn } from "@/components/shared/not-logged-in"
import { Separator } from "@/components/ui/separator"

import { getUserData } from "@/lib/utils"

export default async function SettingsPage() {

    const {session, user} = await getUserData()

    if (!session || !user) {
        return <NotLoggedIn />
    }

    const updateSettingsProps = {
        username: user.userName,
        institution: user.institution,
        department: user.department,
        disciplines: user.disciplines,
        fields: user.fields,
        interests: user.interests,
        about: user.about,
      };

    return (
        <section className="py-8">
            <p>Updating your profile helps you connect with like-minded researchers, showcase your academic journey, and receive personalized opportunities within our community. By sharing your background, research interests, and professional experience, you not only enhance your visibility but also foster collaborations that can drive your work forward. Take a moment to update your profile today and let the community discover your unique contributions to science and nature!</p>
            <Separator className="my-8" />
            <UpdateSettings user={updateSettingsProps} />
        </section>
    )
}