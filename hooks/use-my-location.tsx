import { useState } from "react";

export function useMyLocation() {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null)
    const [address, setAddress] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser")
            return
        }

        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude })

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json()

                    if (data && data.display_name) {
                        setAddress(data.display_name)
                    }
                } catch (error) {
                    console.error("Error fetching location", error);
                    setError("Failed to fetch location")
                } finally {
                    setLoading(false)
                }
            },
            (error) => {
                setError(error.message)
                setLoading(false)
            }
        )
    }

    return { location, address, error, loading, getCurrentLocation }
}