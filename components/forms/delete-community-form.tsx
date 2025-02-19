"use client";

import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteCommunity } from "@/app/actions";

export function DeleteCommunityForm({ subId }: { subId: string }) {
  
  const router = useRouter();

  async function handleDelete(formData: FormData) {

    const result = await deleteCommunity(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Subcommunity deleted successfully!");
      router.push(result.redirectUrl);
    }
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="subId" value={subId} />
      <Button type="submit" size="icon" variant="destructive">
        <Trash2Icon />
      </Button>
    </form>
  );
}
