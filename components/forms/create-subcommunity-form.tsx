"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/forms/submit-button";

import { createSubCommunity } from "@/app/actions";

export function CreateSubCommunityForm() {
    const [tagValue, setTagValue] = useState("");
    const [tagsArray, setTagsArray] = useState<string[]>([])

    const router = useRouter()

    function handleTagInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setTagValue(value)

        if (value.endsWith(",")) {
            const newTag = value.slice(0, -1).trim()
            if (newTag && !tagsArray.includes(newTag) && tagsArray.length !== 3) {
                setTagsArray((prev) => [...prev, newTag])
            }
            setTagValue("")
        }
    }

    function removeTag(index: number) {
        setTagsArray((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        
        formData.append("tags", JSON.stringify(tagsArray))

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="name" className="line-clamp-1 mb-3">Provide your community name</Label>
                    <div className="relative">
                        <p className="absolute top-1/2 -translate-y-1/2 left-2 w-8 text-primary text-sm tracking-[0px]">g/</p>
                        <Input
                            id="name"
                            name="name"
                            placeholder="community name"
                            className="pl-5"
                            minLength={3}
                            maxLength={60}
                            required
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="hashtag" className="line-clamp-1 mb-3">Hashtags</Label>
                    <Input
                        id="hashtag"
                        name="hashtag"
                        placeholder="Max 10 char. separated with comma"
                        maxLength={15}
                        value={tagValue}
                        onChange={handleTagInput}
                    />
                </div>
                <div className="col-span-2">
                    <Label htmlFor="description" className="line-clamp-1">Description</Label>
                    <p className="my-3" />
                    <Textarea id="description" name="description" placeholder="Provide brief desxription, max 250 char." maxLength={250} />
                </div>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row items-center justify-between">

                <div className="flex flex-wrap gap-2 w-full">
                    {tagsArray.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="p-2 text-sm"
                        >
                            #{tag}
                            <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() => removeTag(index)}
                            >
                                &times;
                            </button>
                        </Badge>
                    ))}
                </div>

                <div className="w-full sm:w-max flex gap-2 justify-end">
                    <Button variant="secondary" asChild className="w-full sm:w-max">
                        <Link href={"/"}>Cancel</Link>
                    </Button>
                    <SubmitButton classNames="w-full sm:w-max" title="Create" pendingTitle="Loading..." />
                </div>

            </div>

        </form>
    )
}