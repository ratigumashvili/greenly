"use server";

import { revalidatePath } from "next/cache";
import { generateUsername } from "unique-username-generator"
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { getUserData } from "@/lib/utils";
import { Prisma, TypeOfVote } from "@prisma/client";

export async function loginWithCredentials(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error("SignIn Error:", result.error);
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("LoginWithCredentials Error:", errorMessage);
    return { error: errorMessage };
  } finally {
    revalidatePath("/")
  }
}


export async function registerUser(name: string, email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        userName: generateUsername("-", 0, 15),
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Something went wrong during registration" };
  }
}

export async function registerAndSignIn(name: string, email: string, password: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        userName: generateUsername("-", 0, 15),
        email,
        password: hashedPassword,
      },
    });

    const result = await signIn("credentials", {
      email: user.email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Auto-login failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Registration failed" };
  }
}

export async function updateUserInfo(formData: FormData) {
  const { session, user } = await getUserData();

  if (!session || !user) {
    return { error: "Unauthorized" };
  }

  const newUsername = formData.get("username") as string | null;
  const institution = formData.get("institution") as string | null;
  const department = formData.get("department") as string | null;
  const disciplines = formData.get("disciplines") as string | null;
  const fields = formData.get("fields") as string | null;
  const interests = formData.get("interests") as string | null;
  const about = formData.get("about") as string | null;

  if (typeof newUsername !== "string" || !newUsername.trim()) {
    return { error: "Invalid username" };
  }

  if (newUsername !== user.userName) {
    const existingUser = await prisma.user.findFirst({
      where: {
        userName: newUsername,
        NOT: {
          email: user.email,
        },
      },
    });

    if (existingUser) {
      return { error: "Username already taken" };
    }
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      userName: newUsername,
      institution,
      department,
      disciplines,
      fields,
      interests,
      about,
    },
  });

  return {
    message: "Successfully updated user information",
  };
}

export async function createSubCommunity(formData: FormData) {
  const { session } = await getUserData();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const rawTags = formData.get("tags");
    let tags: string[] = [];

    try {
      if (rawTags && typeof rawTags === "string" && rawTags.trim() !== "") {
        tags = JSON.parse(rawTags);
      }
    } catch (error) {
      console.log(error)
      return { error: "Invalid tags format" };
    }

    const tagEntries = await Promise.all(
      tags.map(async (tag) =>
        prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        })
      )
    );

    const data = await prisma.subcommunity.create({
      data: {
        name,
        description,
        User: {
          connect: {
            email: session.user.email as string,
          },
        },
        tags: {
          create: tagEntries.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
    });

    return { success: true, redirectUrl: `/g/${data.id}` };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Subcommunity name already taken!" };
      }
    }
    console.error("Subcommunity Creation Error:", error);
    return { error: "Failed to create subcommunity" };
  }
}

export async function updateSubCommunity(formData: FormData) {
  const { session } = await getUserData();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const id = formData.get("id") as string;
    const newName = formData.get("name") as string;
    const newDescription = formData.get("description") as string;

    const rawTags = formData.get("tags");
    let tags: string[] = [];

    try {
      if (rawTags && typeof rawTags === "string" && rawTags.trim() !== "") {
        tags = JSON.parse(rawTags);
      }
    } catch (error) {
      console.log(error)
      return { error: "Invalid tags format" };
    }

    const existingSubCommunity = await prisma.subcommunity.findUnique({
      where: { id },
    });

    if (!existingSubCommunity) {
      return { error: "Subcommunity not found!" };
    }

    if (existingSubCommunity.name !== newName) {
      const nameExists = await prisma.subcommunity.findUnique({
        where: { name: newName },
      });

      if (nameExists) {
        return { error: "Subcommunity name already taken!" };
      }
    }

    const tagEntries = await Promise.all(
      tags.map(async (tag) =>
        prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        })
      )
    );

    const data = await prisma.subcommunity.update({
      where: { id },
      data: {
        name: newName,
        description: newDescription ?? "",
        tags: {
          deleteMany: {},
          create: tagEntries.map((tag) => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },
      },
    });

    return { success: true, redirectUrl: `/g/${data.id}` };
  } catch (error) {
    console.error("Subcommunity Update Error:", error);
    return { error: "Failed to update subcommunity" };
  }
}


export async function deleteCommunity(formData: FormData) {
  try {
    const subId = formData.get("subId") as string;

    if (!subId) {
      return { error: "Invalid subcommunity ID." };
    }

    const existingSub = await prisma.subcommunity.findUnique({
      where: { id: subId },
      include: {
        tags: true,
      },
    });

    if (!existingSub) {
      return { error: "Subcommunity not found." };
    }

    await prisma.subcommunityTag.deleteMany({
      where: { subcommunityId: subId },
    });

    await prisma.subcommunityMember.deleteMany({
      where: { subcommunityId: subId },
    });

    await prisma.subcommunity.delete({
      where: { id: subId },
    });

    await prisma.tag.deleteMany({
      where: {
        subcommunities: { none: {} },
      },
    });

    return { success: true, redirectUrl: "/g/" };
  } catch (error) {
    console.log(error)
    return { error: "Failed to delete subcommunity" };
  }
}

export async function joinCommunity(subcommunityId: string) {
  try {
    const { session, user } = await getUserData();

    if (!session || !user?.id) {
      return { error: "Unauthorized" }; // ✅ Ensure user is authenticated
    }

    const userId = user.id;

    const existingMember = await prisma.subcommunityMember.findUnique({
      where: {
        userId_subcommunityId: {
          userId,
          subcommunityId,
        },
      },
    });

    if (existingMember) {
      return { success: false, message: "Already a member" };
    }

    await prisma.subcommunityMember.create({
      data: { userId, subcommunityId },
    });

    revalidatePath(`/g/${subcommunityId}`);

    return { success: true, message: "Joined successfully" };
  } catch (error) {
    console.error("Join Community Error:", error);
    return { error: "Internal Server Error" };
  }
}

export async function leaveCommunity(subcommunityId: string) {
  try {
    const { session, user } = await getUserData();

    if (!session || !user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = user.id;

    const existingMember = await prisma.subcommunityMember.findUnique({
      where: {
        userId_subcommunityId: {
          userId,
          subcommunityId,
        },
      },
    });

    if (!existingMember) {
      return { error: "You're not a member of this group" };
    }

    await prisma.subcommunityMember.delete({
      where: {
        userId_subcommunityId: {
          userId,
          subcommunityId,
        },
      },
    });

    revalidatePath(`/g/${subcommunityId}`);

    return { success: true, message: "Left the group successfully" };
  } catch (error) {
    console.error("Leave Community Error:", error);
    return { error: "Failed to leave the group" };
  }
}

export async function getSubcommunityMembers(subcommunityId: string) {
  try {
    const members = await prisma.subcommunityMember.findMany({
      where: { subcommunityId },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            userName: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, members };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { error: "Failed to fetch members" };
  }
}

export async function kickMember(subcommunityId: string, memberEmail: string) {
  const { user, isMember, role } = await getUserData(subcommunityId);

  console.log("🔹 Kick Member - User Role:", role);
  console.log("🔹 Kick Member - Is Member?", isMember);

  if (!user || !isMember) {
    return { error: "Unauthorized" };
  }

  if (role !== "admin") {
    console.error("❌ User is NOT an admin, cannot manage members.");
    return { error: "Only admins can manage members" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: memberEmail },
    select: { id: true },
  });

  if (!targetUser) {
    return { error: "User not found" };
  }

  const targetMember = await prisma.subcommunityMember.findUnique({
    where: { userId_subcommunityId: { userId: targetUser.id, subcommunityId } },
    select: { role: true },
  });

  if (!targetMember) {
    return { error: "User is not a member" };
  }

  if (targetMember.role === "admin") {
    return { error: "You cannot remove another admin" };
  }

  await prisma.subcommunityMember.delete({
    where: { userId_subcommunityId: { userId: targetUser.id, subcommunityId } },
  });

  return { success: true, message: "Member removed successfully" };
}

export async function promoteToAdmin(subcommunityId: string, memberEmail: string) {
  const { user, isMember, role } = await getUserData(subcommunityId);

  if (!user || !isMember) {
    console.error("❌ Authorization failed: No user or not a member");
    return { error: "Unauthorized" };
  }

  if (role !== "admin") {
    console.error("❌ Authorization failed: User is not an admin");
    return { error: "Only admins can promote members" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: memberEmail },
    select: { id: true },
  });

  if (!targetUser) {
    console.error("❌ User not found in database!");
    return { error: "User not found" };
  }

  const targetMember = await prisma.subcommunityMember.findUnique({
    where: { userId_subcommunityId: { userId: targetUser.id, subcommunityId } },
    select: { role: true },
  });

  if (!targetMember) {
    return { error: "User is not a member" };
  }

  if (targetMember.role === "admin") {
    return { error: "User is already an admin" };
  }

  await prisma.subcommunityMember.update({
    where: { userId_subcommunityId: { userId: targetUser.id, subcommunityId } },
    data: { role: "admin" },
  });

  return { success: true, message: "User promoted to admin successfully" };
}

export async function getMemberCount(subcommunityId: string) {
  try {
    const count = await prisma.subcommunityMember.count({
      where: { subcommunityId },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error fetching member count:", error);
    return { error: "Failed to fetch member count" };
  }
}

export async function createPost(formData: FormData) {
  const subcommunityId = formData.get("subcommunityId") as string;
  const title = formData.get("title") as string;
  const content = (formData.get("content") as string) || "";

  const imagesUrl = formData.get("imagesUrl") ? JSON.parse(formData.get("imagesUrl") as string) : [];
  const file = formData.get("file") ? JSON.parse(formData.get("file") as string) : null;

  if (!title || !subcommunityId) {
    return { error: "Title and subcommunity are required." };
  }

  const { session, user, isMember } = await getUserData(subcommunityId);

  if (!session || !user?.id) {
    return { error: "Unauthorized" };
  }

  if (!isMember) {
    return { error: "Only community members can create posts" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imagesUrl,
        file,
        authorId: user.id,
        subcommunityId,
      },
    });

    return { success: true, message: "Post created successfully", post };
  } catch (error) {
    console.error("Create Post Error:", error);
    return { error: "Failed to create post. Please try again." };
  }
}

export async function handleVote(formData: FormData) {
  const { session, user } = await getUserData();

  if (!session || !user?.id) {
    return;
  }

  const postId = formData.get("postId") as string
  const direction = formData.get("direction") as TypeOfVote
  const subcommunity = formData.get("subcommunity") as string

  const existingVote = await prisma.vote.findFirst({
    where: {
      postId: postId,
      userId: user.id
    }
  })

  if (existingVote) {
    if (existingVote.voteType === direction) {
      await prisma.vote.delete({
        where: {
          id: existingVote.id
        }
      })
      return revalidatePath(`/g/${subcommunity}`)
    }
    else {
      await prisma.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          voteType: direction,
        },
      });
      return revalidatePath(`/g/${subcommunity}`);
    }
  }

  await prisma.vote.create({
    data: {
      voteType: direction,
      userId: user.id,
      postId: postId
    }
  })

  return revalidatePath(`/g/${subcommunity}`)
}

export async function getCommentsForPost(postId: string) {
  if (!prisma) {
    console.error("Prisma is undefined! Ensure it's imported correctly.");
    return [];
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: { select: { id: true, userName: true } },
        votes: { select: { id: true, userId: true, voteType: true, commentId: true } },
        replies: {
          include: {
            author: { select: { id: true, userName: true } },
            votes: { select: { id: true, userId: true, voteType: true, commentId: true } },
            replies: {
              include: {
                author: { select: { id: true, userName: true } },
                votes: { select: { id: true, userId: true, voteType: true, commentId: true } },
              },
            },
          },
        },
      },
    });

    console.log("✅ Comments fetched successfully:", comments.length);
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(formData: FormData) {
  const { session, user, isMember } = await getUserData(formData.get("subcommunityId") as string);

  if (!session || !user?.id) {
    return { error: "Unauthorized" };
  }

  if (!isMember) {
    return { error: "Only members can comment." };
  }

  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;
  let parentId = formData.get("parentId") as string | null;

  if (!content || !postId) {
    return { error: "Content and post ID are required." };
  }

  if (!parentId || parentId.trim() === "" || parentId === "null") {
    parentId = null;
  }

  try {
    if (parentId) {

      let depth = 1;

      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: {
          parent: {
            select: {
              parent: {
                select: { id: true },
              }
            }
          }
        }
      });

      if (!parentComment) {
        console.error("Parent comment does not exist!");
        return { error: "Parent comment does not exist." };
      }

      if (parentComment?.parent?.parent) {
        return { error: "You cannot reply more than 3 levels deep." };
      }

      depth = 2;
      if (parentComment?.parent) {
        depth = 3;
        console.log(depth)
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: user.id,
        postId,
        parentId,
      },
    });

    return { success: true, message: "Comment created successfully", comment };
  } catch (error) {
    console.error("Create Comment Error:", error);
    return { error: "Failed to create comment." };
  }
}


export async function deleteComment(idToDelete: string) {
  const { session, user } = await getUserData("");

  if (!session || !user?.id) {
    return { error: "Unauthorized" };
  }

  const commentId = idToDelete;

  if (!commentId) {
    return { error: "Comment ID is required." };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        authorId: true,
        author: {
          select: {
            isAdmin: true
          }
        },
      }
    });

    if (!comment) {
      return { error: "Comment not found." };
    }

    if (user.id !== comment.authorId && !comment.author.isAdmin && !user.isAdmin) {
      return { error: "You are not allowed to delete this comment." };
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    return { success: true, message: "Comment deleted successfully." };
  } catch (error) {
    console.error("Delete Comment Error:", error);
    return { error: "Failed to delete comment." };
  }
}

export async function handleCommentVote(formData: FormData) {
  const { session, user } = await getUserData();

  if (!session || !user?.id) {
    return { error: "Unauthorized" };
  }

  const commentId = formData.get("commentId") as string;
  const direction = formData.get("direction") as "UP" | "DOWN";
  const subcommunity = formData.get("subcommunity") as string;

  if (!commentId || !direction || !subcommunity) {
    return { error: "Invalid vote request" };
  }

  try {
    const existingVote = await prisma.commentVote.findFirst({
      where: { commentId, userId: user.id },
    });

    if (existingVote) {
      if (existingVote.voteType === direction) {
        await prisma.commentVote.delete({ where: { id: existingVote.id } });
        return { success: true, message: "Vote removed" };
      } else {
        await prisma.commentVote.update({
          where: { id: existingVote.id },
          data: { voteType: direction },
        });
        return { success: true, message: "Vote changed" };
      }
    }

    await prisma.commentVote.create({
      data: { voteType: direction, userId: user.id, commentId },
    });

    return { success: true, message: "Vote added" };
  } catch (error) {
    console.error("Error handling vote:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deletePost({
  postId,
}: {
  postId: string,
}) {
  try {
    await prisma.post.delete({
      where: {
        id: postId
      }
    })

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post." };
  }
}

export async function updatePost({
  postId,
  title,
  content,
  imagesUrl,
}: {
  postId: string;
  title: string;
  content: any;
  imagesUrl?: string[];
}) {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        imagesUrl,
      },
    });

    return { success: true, message: "Post updated successfully", post: updatedPost };
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Failed to update post." };
  }
}

export async function getAllTags() {
  const data = await prisma.tag.findMany({
    select: {
      name: true
    }
  })
  return data
}

export async function getDataByTag(tagName: string) {

  if (!tagName) return []

  const data = await prisma.subcommunity.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: tagName
          }
        }
      }
    },
    select: {
      id: true,
      name: true,
    }
  })

  return data
}

export async function getCommunitiesByName(communityName: string) {

  if (!communityName) return []

  try {
    const data = await prisma.subcommunity.findMany({
      where: {
        name: {
          contains: communityName,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export async function getUsersByName(passedName: string) {

  if (!passedName) return []

  try {
    const data = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: passedName,
              mode: "insensitive"
            }
          },
          {
            userName: {
              contains: passedName,
              mode: "insensitive"
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        userName: true
      }
    })

    return data
  } catch (error) {
    console.log(error)
  }
}

export async function getPostsByTitle(passedName: string) {

  if (!passedName) return []

  try {
    const data = await prisma.post.findMany({
      where: {
        title: {
          contains: passedName,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        title: true,
        subcommunityId: true,
        author: {
          select: {
            id: true,
            name: true,
            userName: true
          }
        }
      }
    })

    return data

  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}






export async function toggleBookmark(postId: string, userId: string) {
  if (!postId || !userId) return { error: "Invalid request." };

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      return { success: true, message: "Bookmark removed." };
    } else {
      await prisma.bookmark.create({
        data: { userId, postId },
      });
      return { success: true, message: "Bookmark added." };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { error: "Failed to update bookmark." };
  }
}

export async function isPostBookmarked(postId: string, userId: string) {
  if (!postId || !userId) return false;

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    return !!bookmark;
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return false;
  }
}

export async function addBookmark(userId: string, postId: string) {
  try {
    return await prisma.bookmark.create({
      data: { userId, postId },
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return null;
  }
}

export async function removeBookmark(userId: string, postId: string) {
  try {
    const data = await prisma.bookmark.delete({
      where: { userId_postId: { userId, postId } },
    });

    revalidatePath("/bookmarks")
    return data
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return null;
  }
}

export async function getUserBookmarks(userId: string) {
  try {
    return await prisma.bookmark.findMany({
      where: { userId },
      include: { post: true },
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}


