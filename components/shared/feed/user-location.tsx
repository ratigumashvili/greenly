"use client"

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { getCoordinates } from "@/lib/utils";

const UserLocationMap = dynamic(() => import("./user-location-map"), {
    ssr: false
})

export function UserLocation({ address, postId }: { address: string, postId: string }) {

    const [coords, setCoords] = useState<[number, number] | null>(null)

    useEffect(() => {
        async function getUserCoordinates() {
            const data = await getCoordinates(address)
            setCoords([data.latitude, data.longitude])
        }
        getUserCoordinates()
    }, [postId])

    if (!address || !coords) return

    return (
        <div className="flex items-center gap-2">
            {address}
            <UserLocationMap coords={coords} address={address} />
        </div>
    )
}