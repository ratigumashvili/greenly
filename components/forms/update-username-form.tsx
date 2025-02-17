"use client"

import Link from "next/link"
import { toast } from "sonner"

import { SubmitButton } from "@/components/forms/submit-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { updateUserName } from "@/app/actions"

interface UpdateUsernameFormProps {
    username: string
}

export function UpdateUsernameForm({ username }: UpdateUsernameFormProps) {
    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const result = await updateUserName(formData)

        if (result?.error) {
            toast(`${result?.error}`)
        } else {
            toast.success(`${result.message}`)
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <Input type="text" name="username" defaultValue={username} />
            <SubmitButton title="Update" pendingTitle="Loading..." classNames="w-max" />
            <Button variant="secondary" asChild>
                <Link href={'/'}>Cancel</Link>
            </Button>
        </form>
    )
}