
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number,
    totalPages: number
}

export function Pagination({currentPage, totalPages}: PaginationProps) {
    return (
        <div className="flex justify-center gap-4 mt-4">
            {currentPage > 1 && (
                <Button asChild className="w-max">
                    <Link href={`?page=${currentPage - 1}`} className="w-full">Previous</Link>
                </Button>
            )}
            {currentPage < totalPages && (
                <Button asChild className="w-max">
                    <Link href={`?page=${currentPage + 1}`} className="w-full">Next</Link>
                </Button>
            )}
        </div>
    )
}