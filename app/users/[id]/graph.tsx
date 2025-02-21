"use client"

import dynamic from "next/dynamic"
import { DynamicGraphUserProps } from "./page";

const NetworkGraph = dynamic(() => import("@/components/shared/network-graph"), { ssr: false })

export default function DynamicGraph({ user }: {user: DynamicGraphUserProps}) {
    return (
        <section>
            <h2 className="font-bold text-xl mb-4">{user.name}'s Community Network</h2>
            <NetworkGraph user={user} />
        </section>
    );
}