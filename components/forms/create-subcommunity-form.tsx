"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";

import { createSubCommunity } from "@/app/actions";

export function CreateSubCommunityForm() {

    const router = useRouter()

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const result = await createSubCommunity(formData)

        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            toast.success("Subcommunity created successfully!")
            router.push(result.redirectUrl)
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-end">
                <div className="flex-1 mb-2 sm:mb-0">
                    <Label htmlFor="name">Provide your community name</Label>
                    <div className="relative mt-2">
                        <p className="absolute top-1/2 -translate-y-1/2 left-2 w-8 text-primary text-sm tracking-[3px]">g/</p>
                        <Input
                            id="name"
                            name="name"
                            placeholder="community name"
                            className="pl-6"
                            minLength={3}
                            maxLength={250}
                            required
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button variant="secondary" asChild className="w-full sm:w-max">
                        <Link href={"/"}>Cancel</Link>
                    </Button>
                    <SubmitButton classNames="w-full sm:w-max" title="Create" pendingTitle="Loading..." />
                </div>
            </div>
        </form>
    )
}