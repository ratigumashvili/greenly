import Link from "next/link";
import { DynamicGraphUserProps } from "./page";
import { CreatedAt } from "@/components/shared/created-at";

export function UsersPosts({ user }: { user: DynamicGraphUserProps }) {
    return (
        user.Posts.length !== 0 && (
            <section className="mb-10">
                <h2 className="font-bold text-xl mb-4">{user.name}&apos;s Posts</h2>
                <ul className=" space-y-2 list-disc ml-4">
                    {user.Posts.map((post) => (
                        <li key={post.postId} className="text-base">
                            <Link href={`/g/posts/${post.postId}?communityId=${post.subcommunityId}`} className="text-primary hover:text-primary/90 transition">
                                {post.postTitle}
                            </Link>.
                            in <Link href={`/g/${post.subcommunity.id}`} className="italic">
                                {post.subcommunity.name}
                            </Link>,{" "}
                            <CreatedAt date={post.createdAt} />
                        </li>
                    ))}
                </ul>
            </section>
        )
    )
}