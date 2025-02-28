"use client"

import { Icon } from "leaflet"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import ResetSearchParamsButton from "./reset-searchparams-button"

interface MapProps {
    locations: {
        location: string,
        coordinates: { latitude: number, longitude: number }
    }[]
    handleMarkerClick: (location: string) => void
}

export const icon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [28, 28],
})

export default function MapComponent({ locations, handleMarkerClick }: MapProps) {
    return (
        <MapContainer center={[41.725567749999996, 44.721836800000005]} zoom={7} style={{ width: "100%", height: "500px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ResetSearchParamsButton />

                {locations.map(({ location, coordinates }) => (
                    <Marker
                        key={location}
                        icon={icon}
                        position={[coordinates.latitude, coordinates.longitude]}
                        eventHandlers={{
                            click: (e) => {
                                e.originalEvent.stopPropagation();
                                handleMarkerClick(location);
                            }
                        }}
                    >
                        <Popup>{location}</Popup>
                    </Marker>
                ))}
        </MapContainer>
    )
}