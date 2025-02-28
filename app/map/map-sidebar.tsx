"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { CreatedAt } from "@/components/shared/created-at"

export function MapSidebar() {

    const searchParams = useSearchParams()
    const location = searchParams.get("location")
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (location) {
            fetch(`/api/posts?location=${encodeURIComponent(location)}`)
                .then(res => res.json())
                .then(data => setPosts(data))
                .catch(error => console.error("Error fetching posts: ", error))
        }
    }, [location])

    return (
        <div className="w-full max-w-[500px] overflow-y-auto">
            {location
                ? <h2 className="text-xl font-medium">Posts from {location}</h2>
                : <h2 className="text-xl font-medium">Click on markers to load data</h2>}

            <Separator className="my-4" />

            {posts && location && posts.length !== 0 && (
                posts?.map((post) => (
                    <div key={post.id} className="mb-4">
                        <Link href={`/g/posts/${post.id}?communityId=${post.subcommunityId}`} className="underline text-primary hover:text-primary/90 transition block mb-2">
                            {post.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                            By: @<Link href={`/users/${post.author.id}`}>{post.author.userName}</Link>, <CreatedAt date={post.createdAt} />
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}