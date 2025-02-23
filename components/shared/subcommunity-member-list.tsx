"use client";

import { useEffect, useState } from "react";
import { getSubcommunityMembers } from "@/app/actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberCount } from "@/components/shared/member-count"

import { separator } from "@/lib/utils"
import Link from "next/link";
import { Button } from "../ui/button";

interface SubcommunityMemberListProps {
  subcommunityId: string;
  isMember: boolean
}

export function SubcommunityMemberList({ subcommunityId, isMember }: SubcommunityMemberListProps) {
  const [members, setMembers] = useState<{ id: string; userName: string; name?: string }[]>([]);
  const [showAll, setShowAll] = useState(false)

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
        {members && members.length !== 0 && !showAll ? (
          <>
            {members.slice(0, 3).map((member, index) => (
              <span key={member.id}>
                <Link href={`/users/${member.id}`}>@{member.userName}</Link>
                {separator(index, members.slice(0, 3), ", ", "...")}
              </span>
            ))}
            {members.length > 3 && <span className="cursor-pointer text-muted-foreground" onClick={() => setShowAll(!showAll)}> and {members.length - 3} more</span>}
          </>
        ) : (
          <>
            {members.map((member, index) => (
              <span key={member.id}>
                <Link href={`/users/${member.id}`}>@{member.userName}</Link>
                {separator(index, members, ", ", ". ")}
              </span>
            ))}
            <span className="cursor-pointer text-muted-foreground" onClick={() => setShowAll(!showAll)}>Show less</span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
