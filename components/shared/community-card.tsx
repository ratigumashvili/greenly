import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreatedAt } from "@/components/shared/created-at";
import Link from "next/link";

interface CommunityCardProps {
    id: string,
    name: string,
    description: string | null,
    User: {
        userName: string
    } | null,
    createdAt: Date,

}

export function CommunityCard({
    id,
    name,
    description,
    User,
    createdAt
}: CommunityCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle><h2 className="line-clamp-1">{name}</h2></CardTitle>
            </CardHeader>
            <CardDescription>
                <CardContent>
                    <p className="line-clamp-3">{description}</p>
                </CardContent>
            </CardDescription>
            <CardFooter className="flex flex-col gap-4">
                <div className="text-sm w-full flex flex-col md:flex-row md:justify-between items-start gap-2 ">
                    <p>Created by: <span className="font-bold">@{User?.userName}</span></p>
                    <p><CreatedAt date={createdAt} /></p>
                </div>
                <Button asChild>
                    <Link href={`/g/${id}`} className="w-full">View group</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}