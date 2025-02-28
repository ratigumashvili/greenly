"use client"

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const UserLocationMap = dynamic(() => import("./user-location-map"), {
    ssr: false
})

async function getCoordinates(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
            return { error: "Address not found." };
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        return { error: "Failed to fetch coordinates." };
    }
}

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