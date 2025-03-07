"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface GraphNode {
    id: string;
    name: string;
    type: "user" | "community";
    color: string;
}

interface GraphLink {
    source: string;
    target: string;
}

interface NetworkGraphProps {
    user: {
        id: string;
        name: string;
        SubcommunityMember: {
            subcommunityId: string;
            subcommunityName: string;
            role: string;
        }[];
    };
}

const NetworkGraph = ({ user }: NetworkGraphProps) => {
    const fgRef = useRef<any>(null);
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
        nodes: [],
        links: [],
    });

    const [selectedCommunity, setSelectedCommunity] = useState<{ id: string; name: string } | null>(null);
    const [communityMembers, setCommunityMembers] = useState<{ id: string; name: string }[]>([]);

    const { state } = useSidebar();

    useEffect(() => {
        if (!user) return;

        const nodes: GraphNode[] = [
            { id: user.id, name: user.name, type: "user", color: "blue" },
            ...user.SubcommunityMember.map((sc) => ({
                id: sc.subcommunityId,
                name: sc.subcommunityName,
                type: "community" as const,
                color: "green",
            })),
        ];

        const links: GraphLink[] = user.SubcommunityMember.map((sc) => ({
            source: user.id,
            target: sc.subcommunityId,
        }));

        setGraphData({ nodes, links });
    }, [user]);

    async function fetchCommunityMembers(communityId: string) {
        try {
            const response = await fetch(`/api/community-members?communityId=${communityId}`);
            const data = await response.json();
            setCommunityMembers(data.members);
        } catch (error) {
            console.error("Error fetching community members:", error);
        }
    }

    const handleNodeClick = (node: GraphNode) => {
        if (!node) return;
        setSelectedCommunity(null)

        if (node.type === "community") {
            setSelectedCommunity({ id: node.id, name: node.name });
            fetchCommunityMembers(node.id);
        }
    };

    return (
        <div
            className={`w-full max-w-7xl relative overflow-hidden inset-0 pointer-events-auto transition-all duration-300 ${state === "expanded" ? "-z-[1]" : "z-10"}`}
        >
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="name"
                nodeAutoColorBy="type"
                linkDirectionalArrowLength={4.5}
                linkDirectionalArrowRelPos={1}
                linkColor={() => "#333"}
                onNodeClick={handleNodeClick}
                height={600}
                backgroundColor="#f1f1f1"
                nodeRelSize={6}
                showNavInfo={false}
            />

            {selectedCommunity && (
                <div className="absolute right-0 top-0 w-80 h-[600px] overflow-y-auto bg-white p-4 shadow-lg z-[80]">
                    <h2 className="text-xl font-bold mb-2">
                        Members of &quot;{selectedCommunity.name}&quot;
                    </h2>
                    <ul>
                        {communityMembers.length === 0 ? (
                            <p>Loading...</p>
                        ) : (
                            communityMembers.map((member) => (
                                <li key={member.id} className="py-2 border-b last:border-b-0 text-base">
                                    <Link href={`/users/${member.id}`}>{member.name}</Link>
                                </li>
                            ))
                        )}
                    </ul>
                    <Button
                        className="mt-4"
                        onClick={() => setSelectedCommunity(null)}
                    >
                        Close
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NetworkGraph;
