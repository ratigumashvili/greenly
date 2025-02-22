"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/shared/tip-tap";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/forms/submit-button";
import { useRouter } from "next/navigation";

import { createPost } from "@/app/actions";
import { toast } from "sonner";

export function CreatePostForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
  
    const formData = new FormData(event.currentTarget);
  
    try {
      const response = await createPost(formData);
  
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Post created successfully");
        router.push(`/g/${id}`);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Submission Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form className="h-full" onSubmit={handleSubmit}>
       <pre>
       loading???? {JSON.stringify(isLoading, null, 2)}
       </pre>
      <input type="hidden" name="subcommunityId" value={id} />
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="title" className="text-base">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Provide a descriptive title"
              className="p-4 text-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content" className="text-base">
              Content
            </Label>
            <Tiptap />
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="secondary" className="mr-2">
            <Link href={`/g/${id}`}>Cancel</Link>
          </Button>
          <SubmitButton title="Create post" pendingTitle="Creating..." isLoading={isLoading} />
        </CardFooter>
      </Card>
    </form>
  );
}
