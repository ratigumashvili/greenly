"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function ResetSearchParamsButton() {
    const router = useRouter();
    const map = useMap();

    useEffect(() => {
        const ResetControl = L.Control.extend({
            onAdd: function () {
                const button = L.DomUtil.create("button", "leaflet-bar leaflet-control leaflet-control-custom");
                button.innerHTML = "X";
                button.style.fontWeight = "bold";
                button.style.cursor = "pointer";
                button.style.padding = "6px 12px";
                button.style.backgroundColor = "white";
                button.style.border = "1px solid #9C9C9C";
                button.style.borderRadius = "4px";
                button.title = "Reset"

                button.onclick = () => {
                    router.push("/map");
                };

                return button;
            }
        });

        const resetControl = new ResetControl({ position: "topleft" });
        resetControl.addTo(map);

        return () => {
            map.removeControl(resetControl);
        };
    }, [map, router]);

    return null;
}
