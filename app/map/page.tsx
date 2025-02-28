"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { PageTitle } from "@/components/shared/page-title";
import { MapSidebar } from "./map-sidebar";

import { useIsMounted } from "@/hooks/use-is-mounted";

const MapComponent = dynamic(() => import("./map-component"), {
    ssr: false
})

export default function GlobalMap() {
    const [locations, setLocations] = useState<{ location: string, coordinates: { latitude: number, longitude: number } }[]>([])
    const searchParams = useSearchParams()
    const router = useRouter()
    const isMounted = useIsMounted()

    useEffect(() => {
        fetch("/api/locations")
            .then(res => res.json())
            .then(data => setLocations(data))
            .catch(error => console.error("Error loading locations ", error))
    }, [])

    function handleMarkerClick(location: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("location", location)
        router.push(`/map?${params.toString()}`)
    }

    if (!isMounted) return <p>Loading...</p>

    return (
        <section className="py-8">
            <PageTitle>Map</PageTitle>
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4">
                    <MapComponent locations={locations} handleMarkerClick={handleMarkerClick} />
                </div>
                <div className="col-span-2">
                    <MapSidebar />
                </div>
            </div>
        </section>
    )
}