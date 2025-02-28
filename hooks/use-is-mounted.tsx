import { useEffect, useState } from "react";

export function useIsMounted() {
    const [isMoiunted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return { isMoiunted }
}