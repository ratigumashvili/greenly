import { cn } from "@/lib/utils"

interface PageTitleProps {
    children: React.ReactNode,
    classNames?: string
}

export function PageTitle({ children, classNames }: PageTitleProps) {
    return <h2 className={cn("text-2xl font-bold mb-4", classNames)}>{children}</h2>
}