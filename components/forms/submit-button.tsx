"use client"

import { useFormStatus } from "react-dom"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubmitButtonProps {
    children?: React.ReactNode
    title: string,
    pendingTitle: string,
    classNames?: string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
    size?: "default" | "sm" | "lg" | "icon" | null | undefined,
    isLoading?: boolean,
    onClick?: () => void,
}

export function SubmitButton({ children, title, pendingTitle, classNames, variant, size, isLoading }: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        pending ? (
            <Button
                variant={variant}
                size={size}
                type="button"
                disabled={pending || isLoading}
                className={cn("w-full disabled:opacity-50 disabled:cursor-not-allowed", classNames)}
            >
                <Loader2Icon className="animate-spin" /> <span className="ml-2">{pendingTitle}</span>
            </Button>
        ) : (
            <Button
                variant={variant}
                size={size}
                type="submit"
                className={cn("w-full", classNames)}
            >
                {children} {title}
            </Button>
        )
    )
}