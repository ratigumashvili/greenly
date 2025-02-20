"use client";

import { useEffect, useState } from "react";
import { getSubcommunityMembers } from "@/app/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberCount } from "@/components/shared/member-count"

import { separator } from "@/lib/utils"

interface SubcommunityMemberListProps {
  subcommunityId: string;
  isMember: boolean
}

export function SubcommunityMemberList({ subcommunityId, isMember }: SubcommunityMemberListProps) {
  const [members, setMembers] = useState<{ id: string; userName: string; name?: string }[]>([]);

  useEffect(() => {
    async function fetchMembers() {
      const result = await getSubcommunityMembers(subcommunityId);
      if (result.success) {
        setMembers(result.members.map((m) => m.user));
      }
    }
    fetchMembers();
  }, [subcommunityId]);

  return (
    <Card className="my-3">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between">
          <h3>Community Members</h3>
          <MemberCount subcommunityId={subcommunityId} isMember={isMember} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {members && members.length !== 0 && (
          <>
            {members.slice(0, 3).map((member, index) => (
              <span key={member.id}>
                {member.userName}
                {separator(index, members.slice(0, 3), ", ", "...")}
              </span>
            ))}
            {members.length > 3 && <span>and {members.length - 3} more</span>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
