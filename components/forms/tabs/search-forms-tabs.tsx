"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { SearchCommunityTabForm } from "@/components/forms/tabs/search-community-tab-form"
import { SearchUserTabForm } from "@/components/forms/tabs/search-user-tab-form"
import { SearchByTags } from "@/components/forms/tabs/search-tags-tab-form"
import { SearchPostsTabForm } from "@/components/forms/tabs/search-posts-tab-form"

export function SearchFormsTabs({ tags, tagName }: { tags: { name: string }[], tagName: string }) {

    return (
        <Tabs defaultValue="communities">
            <TabsList className="w-full justify-start space-x-2 md:space-x-0">
                <TabsTrigger value="communities" className="text-base">Communities</TabsTrigger>
                <TabsTrigger value="users" className="text-base">Users</TabsTrigger>
                <TabsTrigger value="posts" className="text-base">Posts</TabsTrigger>
                <TabsTrigger value="tags" className="text-base">Tags</TabsTrigger>
            </TabsList>
            <TabsContent value="communities">
                <SearchCommunityTabForm />
            </TabsContent>
            <TabsContent value="users">
                <SearchUserTabForm />
            </TabsContent>
            <TabsContent value="posts">
                <SearchPostsTabForm />
            </TabsContent>
            <TabsContent value="tags">
                <SearchByTags tags={tags} tagName={tagName} />
            </TabsContent>
        </Tabs>
    )

}