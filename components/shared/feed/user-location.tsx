"use client"

import { useEffect, useState } from "react";
import { EarthIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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

export function UserLocation({ address }: { address: string }) {

    const [coords, setCoords] = useState<{ latitude: number, longitude: number } | null>(null)

    useEffect(() => {
        async function getUserCoordinates() {
            const data = await getCoordinates(address)
            setCoords({
                latitude: data.latitude,
                longitude: data.longitude
            })
        }
        getUserCoordinates()
    }, [])

    if (!address) return

    return (
        <div className="flex items-center gap-2">
            {address}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <EarthIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-[625px]">
                    <DialogTitle className="sr-only">Map</DialogTitle>
                    <pre>
                        {JSON.stringify(coords, null, 2)}
                    </pre>
                </DialogContent>
            </Dialog>

        </div>
    )
}