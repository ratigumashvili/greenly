"use server";

import { revalidatePath } from "next/cache";
import { generateUsername } from "unique-username-generator"
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { getUserData } from "@/lib/utils";
import { Prisma } from "@prisma/client";

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
    return { error: "Failed to delete subcommunity" };
  }
}












