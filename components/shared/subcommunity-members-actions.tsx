"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { kickMember, promoteToAdmin, getSubcommunityMembers } from "@/app/actions";
import { useModalStore } from "@/store/modal-store";

interface SubcommunityMemberActionsProps {
  subcommunityId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export function SubcommunityMemberActions({ subcommunityId, currentUserId, isAdmin }: SubcommunityMemberActionsProps) {
  const [members, setMembers] = useState<
    { id: string; userName: string; name?: string; role: string, email: string }[]
  >([]);

  const { openModal } = useModalStore()

  useEffect(() => {
    async function fetchMembers() {
      const result = await getSubcommunityMembers(subcommunityId);
      if (result.success) {
        setMembers(result.members.map((m) => ({
          id: m.user.id,
          userName: m.user.userName,
          name: m.user.name,
          email: m.user.email, // ✅ Ensure email is stored
          role: m.role,
        })));
      }
    }
    fetchMembers();
  }, [subcommunityId]);

  const handleKick = async (memberEmail: string) => {
    const result = await kickMember(subcommunityId, memberEmail);

    if (result.success) {
      toast.success(result.message);
      setMembers(members.filter((member) => member.email !== memberEmail));
    } else {
      toast.error(result.error);
    }
  };

  const handlePromote = async (memberEmail: string) => {

    if (!memberEmail.includes("@")) {
      console.error("❌ Invalid email detected, received:", memberEmail);
      toast.error("Unexpected error: invalid email.");
      return;
    }

    const result = await promoteToAdmin(subcommunityId, memberEmail);

    if (result.success) {
      toast.success(result.message);
      setMembers(members.map((member) =>
        member.email === memberEmail ? { ...member, role: "admin" } : member
      ));
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-semibold mb-2">Community Members</h3>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between space-x-3 p-2 border-b last:border-b-0">
            <div className="flex items-center space-x-3 text-sm">
              <p className="text-gray-700 font-medium">
                <span className="font-bold">@{member.userName}</span> - {member.email}
              </p>
              <p className="text-sm text-gray-500"> {member.role === "admin" ? "(Admin)" : ""}</p>
            </div>

            {isAdmin && member.id !== currentUserId && member.role !== "admin" && (
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  onClick={() =>
                    openModal({
                      title: "Remove Member?",
                      description: `Are you sure you want to remove ${member.name} AKA ${member.userName} from this community?`,
                      confirmText: "Remove",
                      cancelText: "Cancel",
                      onConfirm: () => handleKick(member.email), // ✅ Call handleKick only when confirmed
                    })
                  }
                >
                  Kick
                </Button>

                <Button variant="default" onClick={() => handlePromote(member.email)}>Promote</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
