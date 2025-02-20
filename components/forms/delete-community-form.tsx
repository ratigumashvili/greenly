"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    <div className="space-y-3">
      <h2 className="font-bold text-lg text-red-600">Danger zone</h2>
      <form action={handleDelete}>
        <input type="hidden" name="subId" value={subId} />
        <p>Here you can delete this community. Are you sure you want to proceed? Remember, this action can not be undone.
          <button type="submit">
            <span className="text-base font-bold text-red-600">Delete community</span>
          </button>
        </p>
      </form>
    </div>
  );
}
