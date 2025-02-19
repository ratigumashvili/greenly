"use client";

import { deleteCommunity } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

export function DeleteCommunityForm({ subId }: { subId: string }) {
  const router = useRouter();

  async function handleDelete(formData: FormData) {
    const result = await deleteCommunity(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Subcommunity deleted successfully!");
      router.push(result.redirectUrl); // ✅ Safe redirect in client
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
