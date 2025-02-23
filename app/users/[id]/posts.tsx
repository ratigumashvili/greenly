import Link from "next/link";
import { DynamicGraphUserProps } from "./page";

export function UsersPosts({ user }: { user: DynamicGraphUserProps }) {
    return (
        user.Posts.length !== 0 && (
            <section className="mb-10">
                <h2 className="font-bold text-xl mb-4">{user.name}'s Posts</h2>
                <ul className=" space-y-2 list-disc ml-4">
                    {user.Posts.map((post) => (
                        <li key={post.postId} className="text-base">
                            <Link href={`/g/posts/${post.postId}?communityId=${post.subcommunityId}`}>
                                {post.postTitle}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        )
    )
}