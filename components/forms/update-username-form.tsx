"use client"

import Link from "next/link"
import { toast } from "sonner"

import { SubmitButton } from "@/components/forms/submit-button"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { updateUserInfo } from "@/app/actions"

interface UpdateSettingsProps {
    user: {
        username: string,
        institution: string | null,
        department: string | null,
        disciplines: string | null,
        fields: string | null,
        interests: string | null,
        about: string | null
    }
}

export function UpdateSettings({ user }: UpdateSettingsProps) {
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const result = await updateUserInfo(formData)

        if (result?.error) {
            toast(`${result?.error}`)
        } else {
            toast.success(`${result.message}`)
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="col-span-1 flex flex-col gap-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={user?.username}
                        placeholder="Update your unique username"
                    />
                </div>

                <div className="col-span-1 flex flex-col gap-y-2">
                    <Label htmlFor="institution">Institution/University</Label>
                    <Input
                        type="text"
                        id="institution"
                        name="institution"
                        defaultValue={user.institution ?? ""}
                        placeholder="Institution or University"
                    />
                </div>

                <div className="col-span-1 flex flex-col gap-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                        type="text"
                        id="department"
                        name="department"
                        defaultValue={user.department ?? ""}
                        placeholder="Department"
                    />
                </div>

                <div className="col-span-1 flex flex-col gap-y-2">
                    <Label htmlFor="disciplines">Research Disciplines</Label>
                    <Input
                        type="text"
                        id="disciplines"
                        name="disciplines"
                        defaultValue={user.disciplines ?? ""}
                        placeholder="Provide your disciplines"
                    />
                </div>

                <div className="col-span-1 flex flex-col gap-y-2">
                    <Label htmlFor="fields">Research Fields</Label>
                    <Input
                        type="text"
                        id="fields"
                        name="fields"
                        defaultValue={user.fields ?? ""}
                        placeholder="Tell us your research field"
                    />
                </div>

                <div className="col-span-1 flex flex-col gap-y-2">
                    <Label htmlFor="interests">Research Interests</Label>
                    <Input
                        type="text"
                        id="interests"
                        name="interests"
                        defaultValue={user.interests ?? ""}
                        placeholder="mammals, insects..."
                    />
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-y-2">
                    <Label htmlFor="about">More about you</Label>
                    <Textarea id="about" name="about" defaultValue={user.about ?? ""} placeholder="Tell us about you..." />
                </div>
            </div>

            <div className="flex gap-2 justify-end">
                <SubmitButton title="Update" pendingTitle="Loading..." classNames="w-max" />
                <Button variant="secondary" asChild>
                    <Link href={'/'}>Cancel</Link>
                </Button>
            </div>

        </form>
    )
}