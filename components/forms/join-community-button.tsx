"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useModalStore } from "@/store/modal-store";
import { joinCommunity, leaveCommunity } from "@/app/actions";

interface JoinCommunityButtonProps {
  subcommunityId: string;
  isMember: boolean;
}

export function JoinCommunityButton({ subcommunityId, isMember }: JoinCommunityButtonProps) {
  const [joined, setJoined] = useState(isMember);
  const [pending, startTransition] = useTransition();
  const { openModal } = useModalStore()

  const handleJoin = () => {
    if (joined) return;

    startTransition(async () => {
      const result = await joinCommunity(subcommunityId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Joined successfully!");
        setJoined(true);
      }
    });
  };

  const handleLeave = () => {
    if (!joined) return;

    startTransition(async () => {
      const result = await leaveCommunity(subcommunityId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Left the group successfully!");
        setJoined(false);
      }
    });
  };

  return (
    <div className="flex gap-4">
      {joined
        ? <Button
          variant="destructive"
          onClick={() =>
            openModal({
              title: "Leave this Community?",
              description: "Are you sure you want to leave? You may need to request access again.",
              confirmText: "Leave",
              cancelText: "Cancel",
              onConfirm: handleLeave,
            })
          }
        >
          Leave group
        </Button>
        : <Button className="w-full" onClick={handleJoin} disabled={pending || joined}>
          {joined ? "You're a member" : pending ? "Loading..." : "Join Community"}
        </Button>}
      {isMember && (
        <Button asChild className="w-full">
          <Link href={`/g/${subcommunityId}/create`}>Create post</Link>
        </Button>
      )}
    </div>
  );
}
