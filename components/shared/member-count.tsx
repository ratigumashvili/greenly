"use client"

import { useEffect, useState } from "react";
import { UsersIcon } from "lucide-react";

import { getMemberCount } from "@/app/actions";

interface MemberCountProps {
    subcommunityId: string,
    isMember: boolean
}

export function MemberCount({subcommunityId, isMember}: MemberCountProps) {
    const [memberCount, setMemberCount] = useState(0);

    useEffect(() => {
        async function fetchCount() {
            const result = await getMemberCount(subcommunityId);
            if (result.success) {
                setMemberCount(result.count);
            }
        }
        fetchCount();
    }, [isMember, subcommunityId]);
    return (
        <p className="text-sm flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-muted-foreground" /> {memberCount}
        </p>
    )
}