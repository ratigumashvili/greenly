"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteCommunity } from "@/app/actions";
import { useModalStore } from "@/store/modal-store";

export function DeleteCommunityForm({ subId }: { subId: string }) {

  const router = useRouter();
  const { openModal } = useModalStore()

  const handleDeleteCommunity = async () => {
    const formData = new FormData();
    formData.append("subId", subId);
    const result = await deleteCommunity(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success("Subcommunity deleted successfully!");
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="font-bold text-lg text-red-600">Danger zone</h2>
      <form>
        <input type="hidden" name="subId" value={subId} />
        <p className="text-sm">Here you can delete this community. Are you sure you want to proceed? Remember, this action can not be undone.
          {" "}
          <button
            type="button"
            onClick={() =>
              openModal({
                title: "Delete this community?",
                description: "Are you sure you want to delete this community? This action can not be undone.",
                confirmText: "Delete",
                cancelText: "Cancel",
                onConfirm: handleDeleteCommunity,
              })
            }
          >
            <span className="font-bold text-red-600">Delete community</span>
          </button>
        </p>
      </form>
    </div>
  );
}
