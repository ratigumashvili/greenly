"use client";

import { useEffect, useState } from "react";
import { kickMember, promoteToAdmin, getSubcommunityMembers } from "@/app/actions"; // ✅ Import actions
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubcommunityMemberActionsProps {
  subcommunityId: string;
  currentUserId: string; // ✅ Pass the current user’s ID
  isAdmin: boolean; // ✅ Pass whether the user is an admin
}

export function SubcommunityMemberActions({ subcommunityId, currentUserId, isAdmin }: SubcommunityMemberActionsProps) {
  const [members, setMembers] = useState<
    { id: string; userName: string; name?: string; role: string, email: string }[]
  >([]);

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
    console.log("🔹 Kicking Member Email:", memberEmail); // ✅ Debugging

    const result = await kickMember(subcommunityId, memberEmail);

    if (result.success) {
      toast.success(result.message);
      setMembers(members.filter((member) => member.email !== memberEmail)); // ✅ Filter by email
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
                <Button variant="destructive" onClick={() => handleKick(member.email)}>Kick</Button>
                <Button variant="default" onClick={() => handlePromote(member.email)}>Promote</Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
