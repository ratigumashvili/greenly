import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { EarthIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import "leaflet/dist/leaflet.css"

const icon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28],
})

export default function UserLocationMap({ coords, address }: { coords: [number, number], address: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <EarthIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[625px] p-0">
                <DialogTitle className="sr-only">Map</DialogTitle>
                <MapContainer center={coords} zoom={12} className="h-72 z-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={coords} icon={icon}>
                        <Popup>
                            {address}
                        </Popup>
                    </Marker>
                </MapContainer>
                <DialogFooter className="flex items-center justify-start mb-4 pr-4">
                    latitude: {coords[0]}, longitude: {coords[1]}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}